import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { useDispatch } from 'react-redux';
import { routes } from './app.routes';
import { getMe } from '../features/auth/service/auth.api';
import { setUser, setLoading } from '../features/auth/state/auth.slice';
import { getCart } from '../features/cart/service/cart.api';
import { setCart } from '../features/cart/state/cart.slice';
import { getWishlist } from '../features/wishlist/service/wishlist.api';
import { setWishlist } from '../features/wishlist/state/wishlist.slice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      dispatch(setLoading(true));
      try {
        const data = await getMe();
        dispatch(setUser(data));
        
        // Fetch cart directly here since we know auth succeeded
        try {
          const cartData = await getCart();
          if (cartData.success) {
            dispatch(setCart(cartData.cart));
          }
        } catch (error) {
          console.error("Failed to fetch cart on App load", error);
        }

        // Fetch wishlist directly here
        try {
          const wishlistData = await getWishlist();
          if (wishlistData.success) {
            dispatch(setWishlist(wishlistData.wishlist));
          }
        } catch (error) {
          console.error("Failed to fetch wishlist on App load", error);
        }

      } catch (error) {
        // If getting /get-me fails (Unauthorized), we ensure user is null
        dispatch(setUser(null));
      } finally {
        dispatch(setLoading(false));
      }
    };
    
    checkAuth();
  }, [dispatch]);

  return (
    <>
      <RouterProvider router={routes} />
    </>
  )
}

export default App
