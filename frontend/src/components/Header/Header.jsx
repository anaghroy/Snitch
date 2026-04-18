import React from 'react';
import { Link } from 'react-router';
import { Search, User, Heart, ShoppingBag } from 'lucide-react';
import lightLogo from "../../assets/images/dark-logo.png";

const Header = ({ style }) => {
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
        <button className="icon-btn">
          <User size={22} />
        </button>
        <button className="icon-btn">
          <Heart size={22} />
          <span className="badge">0</span>
        </button>
        <button className="icon-btn">
          <ShoppingBag size={22} />
          <span className="badge">0</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
