import React from 'react';
import { Link, useNavigate } from 'react-router';
import { Search, User, Heart, ShoppingBag, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/service/auth.api';
import { setUser } from '../../features/auth/state/auth.slice';
import { useWishlist } from '../../features/wishlist/hook/useWishlist';
import lightLogo from "../../assets/images/dark-logo.png";

const Header = ({ style }) => {
  const cart = useSelector((state) => state.cart.cart);
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const userObj = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleGetWishlist } = useWishlist();

  React.useEffect(() => {
    if (!wishlist && userObj) {
      handleGetWishlist();
    }
  }, [wishlist, userObj]);

  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  const wishlistItemCount = wishlist?.items?.length || 0;

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(setUser(null));
      navigate('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="home-header" style={style}>
      <div className="header-left">
        <Link to="/" className="nav-link" style={{ textDecoration: "none" }}>
          Home
        </Link>
        <span className="nav-link">Elements</span>
        <span className="nav-link">Shop</span>
        <span className="nav-link">Blog</span>
        <span className="nav-link">Pages</span>
      </div>
      <div className="header-center">
        <Link to="/">
          <img
            src={lightLogo}
            alt="SNITCH"
            className="logo"
            style={style?.boxShadow === "none" ? { height: "50px", filter: "invert(1)" } : { height: "30px" }}
          />
        </Link>
      </div>
      <div className="header-right">
        <button className="icon-btn">
          <Search size={22} color="#111" />
        </button>
        <Link to="/seller/dashboard" className="icon-btn">
          <User size={22} color="#111" />
        </Link>
        <Link to="/wishlist" className="icon-btn">
          <Heart size={22} color="#111" />
          <span className="badge">{wishlistItemCount}</span>
        </Link>
        <Link to="/checkout" className="icon-btn" style={{display: 'flex', alignItems: 'center'}}>
          <ShoppingBag size={22} color="#111" />
          <span className="badge">{cartItemCount}</span>
        </Link>
        {userObj && (
          <button className="icon-btn" style={{color: '#e24e4e'}} onClick={handleLogout} title="Logout">
            <LogOut size={22} />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
