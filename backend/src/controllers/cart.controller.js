import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export async function getCart(req, res) {
  try {
    const userId = req.user._id;
    let cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function addToCart(req, res) {
  try {
    const userId = req.user._id;
    const { productId, quantity, variantId = 'base', attributes = {} } = req.body;

    const qty = Number(quantity);
    if (!productId || isNaN(qty) || qty < 1) {
      return res.status(400).json({ message: "Valid productId and quantity are required" });
    }

    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.variantId === variantId
    );

    if (itemIndex > -1) {
      // Product exists, update quantity
      cart.items[itemIndex].quantity += qty;
    } else {
      // Product does not exist, add it
      cart.items.push({ product: productId, quantity: qty, variantId, attributes });
    }

    await cart.save();
    
    // Return populated cart
    const populatedCart = await Cart.findById(cart._id).populate("items.product");

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function removeFromCart(req, res) {
  try {
    const userId = req.user._id;
    const { itemId } = req.params;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== itemId
    );

    await cart.save();
    
    const populatedCart = await Cart.findById(cart._id).populate("items.product");

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function clearCart(req, res) {
  try {
    const userId = req.user._id;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      cart,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateCartItemQuantity(req, res) {
  try {
    const userId = req.user._id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    const qty = Number(quantity);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({ message: "Valid quantity is required" });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(i => i._id.toString() === itemId);
    if (!item) {
        return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = qty;
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate("items.product");

    res.status(200).json({
      success: true,
      message: "Cart item quantity updated",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
