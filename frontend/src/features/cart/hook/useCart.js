import { useDispatch } from "react-redux";
import { getCart, addToCart } from "../service/cart.api";
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

  async function handleAddToCart(productId, quantity) {
    dispatch(setCartLoading(true));
    try {
      const data = await addToCart(productId, quantity);
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

  return { handleGetCart, handleAddToCart };
};
