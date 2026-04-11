import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { useDispatch } from 'react-redux';
import { routes } from './app.routes';
import { getMe } from '../features/auth/service/auth.api';
import { setUser, setLoading } from '../features/auth/state/auth.slice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      dispatch(setLoading(true));
      try {
        const data = await getMe();
        dispatch(setUser(data));
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
