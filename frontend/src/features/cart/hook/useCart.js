import { useDispatch } from "react-redux";
import { getCart, addToCart, removeFromCart, clearCart } from "../service/cart.api";
import { setCart, setCartLoading } from "../state/cart.slice";

export const useCart = () => {
  const dispatch = useDispatch();

  async function handleGetCart() {
    dispatch(setCartLoading(true));
    try {
      const data = await getCart();
      if (data.success) {
        dispatch(setCart(data.cart));
      }
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      dispatch(setCartLoading(false));
    }
  }

  async function handleAddToCart(productId, quantity, variantId = 'base', attributes = {}) {
    dispatch(setCartLoading(true));
    try {
      const data = await addToCart(productId, quantity, variantId, attributes);
      if (data.success) {
        dispatch(setCart(data.cart));
      }
      return data;
    } catch (error) {
      console.error("Failed to add to cart", error);
      throw error;
    } finally {
      dispatch(setCartLoading(false));
    }
  }

  async function handleRemoveFromCart(itemId) {
    dispatch(setCartLoading(true));
    try {
      const data = await removeFromCart(itemId);
      if (data.success) {
        dispatch(setCart(data.cart));
      }
      return data;
    } catch (error) {
      console.error("Failed to remove from cart", error);
      throw error;
    } finally {
      dispatch(setCartLoading(false));
    }
  }

  async function handleClearCart() {
    dispatch(setCartLoading(true));
    try {
      const data = await clearCart();
      if (data.success) {
        dispatch(setCart(data.cart));
      }
      return data;
    } catch (error) {
      console.error("Failed to clear cart", error);
      throw error;
    } finally {
      dispatch(setCartLoading(false));
    }
  }

  return { handleGetCart, handleAddToCart, handleRemoveFromCart, handleClearCart };
};
