import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useWishlist } from "../../../features/wishlist/hook/useWishlist";
import { useCart } from "../../../features/cart/hook/useCart";
import { X, ShoppingBag } from "lucide-react";
import Header from "../../../components/Header/Header";
import LoadingLines from "../../../components/ui/LoadingLines";
import { getCurrencySymbol } from "../../../utils/currency";
import { useNavigate } from "react-router";

const Wishlist = () => {
  const { handleGetWishlist, handleToggleWishlistItem } = useWishlist();
  const { handleAddToCart } = useCart();
  const { wishlist, loading } = useSelector((state) => state.wishlist);
  const [removingId, setRemovingId] = useState(null);
  const [addingId, setAddingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!wishlist) {
      handleGetWishlist();
    }
  }, [wishlist]);

  const onRemove = async (productId) => {
    setRemovingId(productId);
    try {
      await handleToggleWishlistItem(productId);
    } catch (error) {
      console.error(error);
    } finally {
      setRemovingId(null);
    }
  };

  const onAddToCart = async (product) => {
    setAddingId(product._id);
    try {
      await handleAddToCart(product._id, 1, 'base', { "Size": "Original", "Color": "Original" });
      alert("Product moved to cart!");
      // Optionally remove from wishlist after adding to cart
      await handleToggleWishlistItem(product._id);
    } catch (error) {
      alert("Failed to add to cart");
    } finally {
      setAddingId(null);
    }
  };

  if (loading && !wishlist) {
    return (
      <div style={{ textAlign: "center", padding: "5rem" }}>
        <LoadingLines />
      </div>
    );
  }

  const items = wishlist?.items || [];

  return (
    <>
      <Header style={{ boxShadow: "none", borderBottom: "1px solid #f0f0f0" }} />
      <div className="checkout-container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        
        <div className="cart-header-title" style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "300", letterSpacing: "1px" }}>My Wishlist</h1>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>Home / Wishlist</p>
        </div>

        {items.length === 0 ? (
          <div className="empty-cart-msg" style={{ textAlign: "center", padding: "4rem 2rem", background: "#fafafa", borderRadius: "8px" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "400", color: "#333", marginBottom: "1rem" }}>Your wishlist is currently empty.</h2>
            <button onClick={() => navigate("/")} style={{ padding: "0.8rem 2rem", background: "#000", color: "#fff", border: "none", cursor: "pointer", fontSize: "1rem" }}>Continue Shopping</button>
          </div>
        ) : (
          <div className="wishlist-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
            {items.map((item) => {
              const p = item.product || {};
              const price = p.price?.amount || 0;
              const imgUrl = p.images?.[0]?.url || "";
              const currSym = getCurrencySymbol(p.price?.currency || "USD");

              if (!p._id) return null; // Avoid rendering empty products if ref is broken

              return (
                <div key={p._id} className="wishlist-item-card" style={{ position: "relative", border: "1px solid #eee", overflow: "hidden", transition: "transform 0.3s ease" }}>
                  <button 
                    className="btn-remove" 
                    onClick={() => onRemove(p._id)}
                    disabled={removingId === p._id}
                    style={{ position: "absolute", top: "10px", right: "10px", width: "30px", height: "30px", background: "#fff", border: "1px solid #ddd", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10 }}
                  >
                    <X size={16} />
                  </button>

                  <div className="img-container" style={{ paddingBottom: "130%", position: "relative", background: "#f5f5f5", cursor: "pointer" }} onClick={() => navigate(`/product/${p._id}`)}>
                    {imgUrl ? (
                      <img src={imgUrl} alt={p.title} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>No Image</div>
                    )}
                  </div>

                  <div className="item-details" style={{ padding: "1.5rem" }}>
                    <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title || "Unknown Product"}</h4>
                    <p style={{ color: "#666", margin: "0 0 1rem 0", fontSize: "0.9rem" }}>Brand: {p.brand || "N/A"}</p>
                    <div className="price-and-action" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span className="price" style={{ fontWeight: "700", fontSize: "1.1rem" }}>{currSym}{price.toFixed(2)}</span>
                      <button 
                        onClick={() => onAddToCart(p)}
                        disabled={addingId === p._id}
                        style={{ background: "#000", color: "#fff", border: "none", padding: "0.5rem 1rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}
                      >
                        <ShoppingBag size={14} /> 
                        {addingId === p._id ? "Adding..." : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Wishlist;
