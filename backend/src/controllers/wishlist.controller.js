import Wishlist from "../models/wishlist.model.js";

export async function getWishlist(req, res) {
  try {
    const userId = req.user._id;
    let wishlist = await Wishlist.findOne({ user: userId }).populate("items.product");

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, items: [] });
    }

    res.status(200).json({
      success: true,
      wishlist,
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function toggleWishlistItem(req, res) {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Valid productId is required" });
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, items: [] });
    }

    const itemIndex = wishlist.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Product exists, so REMOVE it from wishlist
      wishlist.items.splice(itemIndex, 1);
    } else {
      // Product does not exist, ADD to wishlist
      wishlist.items.push({ product: productId });
    }

    await wishlist.save();
    
    // Return populated wishlist
    const populatedWishlist = await Wishlist.findById(wishlist._id).populate("items.product");

    res.status(200).json({
      success: true,
      message: itemIndex > -1 ? "Product removed from wishlist" : "Product added to wishlist",
      wishlist: populatedWishlist,
    });
  } catch (error) {
    console.error("Error toggling wishlist item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
