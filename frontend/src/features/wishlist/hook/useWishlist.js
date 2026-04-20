import { useDispatch } from "react-redux";
import { getWishlist, toggleWishlistItem } from "../service/wishlist.api";
import { setWishlist, setWishlistLoading } from "../state/wishlist.slice";

export const useWishlist = () => {
  const dispatch = useDispatch();

  async function handleGetWishlist() {
    dispatch(setWishlistLoading(true));
    try {
      const data = await getWishlist();
      if (data.success) {
        dispatch(setWishlist(data.wishlist));
      }
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    } finally {
      dispatch(setWishlistLoading(false));
    }
  }

  async function handleToggleWishlistItem(productId) {
    dispatch(setWishlistLoading(true));
    try {
      const data = await toggleWishlistItem(productId);
      if (data.success) {
        dispatch(setWishlist(data.wishlist));
      }
      return data;
    } catch (error) {
      console.error("Failed to toggle wishlist item", error);
      throw error;
    } finally {
      dispatch(setWishlistLoading(false));
    }
  }

  return { handleGetWishlist, handleToggleWishlistItem };
};
