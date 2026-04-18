import React from 'react';
import { Link } from 'react-router';
import { Search, User, Heart, ShoppingBag } from 'lucide-react';
import { useSelector } from 'react-redux';
import lightLogo from "../../assets/images/dark-logo.png";

const Header = ({ style }) => {
  const cart = useSelector((state) => state.cart.cart);
  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

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
          <Search size={22} />
        </button>
        <Link to="/seller/dashboard" className="icon-btn" style={{color: 'inherit'}}>
          <User size={22} />
        </Link>
        <button className="icon-btn">
          <Heart size={22} />
          <span className="badge">0</span>
        </button>
        <Link to="/checkout" className="icon-btn" style={{color: 'inherit', display: 'flex', alignItems: 'center'}}>
          <ShoppingBag size={22} />
          <span className="badge">{cartItemCount}</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
