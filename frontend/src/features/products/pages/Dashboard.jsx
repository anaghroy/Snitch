import React, { useEffect } from 'react';
import { useProduct } from "../hook/useProduct";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Plus, 
  LogOut, 
  Package, 
  TrendingUp, 
  IndianRupee,
  Box
} from "lucide-react";

import lightLogo from "../../../assets/images/light-logo.png";
import darkLogo from "../../../assets/images/dark-logo.png";

const Dashboard = () => {
  const { handleGetSellerProduct } = useProduct();
  const sellerProducts = useSelector((state) => state.product.sellerProducts);
  const userState = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    handleGetSellerProduct();
  }, []);

  const currentUser = userState?.user || userState;
  
  const totalProducts = sellerProducts?.length || 0;
  const totalValue = sellerProducts?.reduce((acc, curr) => acc + (curr.priceAmount || 0), 0) || 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <img src={lightLogo} alt="Snitch Logo" />
        </div>
        <nav className="sidebar-nav">
          <button className="nav-item active" onClick={() => navigate("/seller/dashboard")}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          <button className="nav-item" onClick={() => navigate("/seller/create-product")}>
            <Plus size={20} />
            <span>Add Product</span>
          </button>
        </nav>
        <div className="sidebar-footer">
           <button className="nav-item logout" onClick={() => navigate("/login")}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Welcome back, {currentUser?.name || 'Seller'}</h1>
            <p>Here's what's happening with your store today.</p>
          </div>
          <div className="user-profile">
             <div className="avatar">{currentUser?.name?.charAt(0) || 'S'}</div>
          </div>
        </header>

        <section className="dashboard-stats">
          <motion.div className="stat-card" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: 0.1}}>
            <div className="stat-icon"><Package size={24} /></div>
            <div className="stat-info">
              <h3>Total Products</h3>
              <h2>{totalProducts}</h2>
            </div>
          </motion.div>
          <motion.div className="stat-card" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: 0.2}}>
            <div className="stat-icon"><IndianRupee size={24} /></div>
            <div className="stat-info">
              <h3>Total Inventory Value</h3>
              <h2>₹{totalValue.toLocaleString()}</h2>
            </div>
          </motion.div>
          <motion.div className="stat-card" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: 0.3}}>
            <div className="stat-icon"><TrendingUp size={24} /></div>
            <div className="stat-info">
              <h3>Active Status</h3>
              <h2>Live</h2>
            </div>
          </motion.div>
        </section>

        <section className="dashboard-content">
          <div className="section-header">
            <h2>Your Products</h2>
            <button className="btn-primary" onClick={() => navigate("/seller/create-product")}>
               <Plus size={16} /> New Product
            </button>
          </div>

          {sellerProducts?.length === 0 ? (
            <div className="empty-state">
              <Package size={48} />
              <h3>No products found</h3>
              <p>Start adding products to your store.</p>
              <button className="btn-secondary" onClick={() => navigate("/seller/create-product")}>
                Add Your First Product
              </button>
            </div>
          ) : (
            <motion.div 
              className="product-grid"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {sellerProducts?.map((product) => (
                <motion.div key={product._id} className="product-card" variants={itemVariants} onClick={() => navigate(`/seller/product/${product._id}`)} style={{cursor: 'pointer'}}>
                  <div className="product-image">
                    {product.images?.[0] ? (
                      <img src={product.images[0].url || product.images[0]} alt={product.title} />
                    ) : (
                      <div className="image-placeholder"><Box size={32}/></div>
                    )}
                  </div>
                  <div className="product-details">
                    <span className="product-brand">{product.brand}</span>
                    <h4 className="product-title">{product.title}</h4>
                    <p className="product-price">
                       {product.priceCurrency === 'INR' ? '₹' : product.priceCurrency} 
                       {product.priceAmount}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </main>
    </div>
  )
}

export default Dashboard;
