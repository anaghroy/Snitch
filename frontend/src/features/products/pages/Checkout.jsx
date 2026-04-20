import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useCart } from "../../cart/hook/useCart";
import { X, Minus, Plus } from "lucide-react";
import Header from "../../../components/Header/Header";
import LoadingLines from "../../../components/ui/LoadingLines";
import { FaShippingFast, FaCreditCard, FaHeadset } from 'react-icons/fa';
import { getCurrencySymbol } from "../../../utils/currency";

const Checkout = () => {
  const { handleRemoveFromCart, handleClearCart, handleGetCart, handleUpdateQuantity } = useCart();
  const { cart, loading } = useSelector((state) => state.cart);
  const [removingId, setRemovingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Ensure cart is fetched if empty on mount
  useEffect(() => {
    if (!cart) {
      handleGetCart();
    }
  }, [cart]);

  const onRemove = async (productId) => {
    setRemovingId(productId);
    try {
      await handleRemoveFromCart(productId);
    } catch (error) {
      console.error(error);
    } finally {
      setRemovingId(null);
    }
  };

  const onClear = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      await handleClearCart();
    }
  };

  const onUpdateQuantity = async (itemId, currentQty, amount) => {
    const newQty = currentQty + amount;
    if (newQty < 1) return;
    setUpdatingId(itemId);
    try {
      await handleUpdateQuantity(itemId, newQty);
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading && !cart) {
    return (
      <div style={{ textAlign: "center", padding: "5rem" }}>
        <LoadingLines />
      </div>
    );
  }

  const items = cart?.items || [];
  const subtotal = items.reduce(
    (acc, curr) => {
      const vParams = curr.product?.variants?.find(v => v._id === curr.variantId);
      const price = vParams?.price?.amount || curr.product?.price?.amount || 0;
      return acc + (price * curr.quantity);
    },
    0
  );
  
  // Example dummy values
  const shipping = 0;
  const taxes = 0;
  const total = subtotal + shipping + taxes;

  const defaultCurrencyCode = items[0]?.product?.price?.currency || "USD";
  const currSym = getCurrencySymbol(defaultCurrencyCode);

  return (
    <>
      <Header style={{ boxShadow: "none", borderBottom: "1px solid #f0f0f0" }} />
      <div className="checkout-container">
        
        <div className="cart-header-title">
          <h1>Shopping Cart</h1>
          <p>Home / Shopping Cart</p>
        </div>

        {items.length === 0 ? (
          <div className="empty-cart-msg">
            <h2>Your cart is currently empty.</h2>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-left">
              <div className="cart-table-header">
                <div className="col-product">Product</div>
                <div className="col-price">Price</div>
                <div className="col-quantity">Quantity</div>
                <div className="col-subtotal">Subtotal</div>
              </div>

              <div className="cart-items-list">
                {items.map((item) => {
                  const p = item.product || {};
                  const vParams = p.variants?.find(v => v._id === item.variantId);
                  const price = vParams?.price?.amount || p.price?.amount || 0;
                  const itemSubtotal = price * item.quantity;
                  const imgUrl = vParams?.images?.[0]?.url || p.images?.[0]?.url || "";

                  return (
                    <div className="cart-item-row" key={item._id}>
                      <button 
                        className="btn-remove" 
                        onClick={() => onRemove(item._id)}
                        disabled={removingId === item._id}
                      >
                        <X size={16} />
                      </button>
                      
                      <div className="item-info">
                        <div className="item-img">
                          {imgUrl ? <img src={imgUrl} alt={p.title} /> : <div className="no-img">No Img</div>}
                        </div>
                        <div className="item-details">
                          <h4>{p.title || "Unknown Product"}</h4>
                          <p>Brand : {p.brand || "N/A"}</p>
                          {item.attributes && Object.entries(item.attributes).map(([key, val]) => (
                             <p key={key} style={{ fontSize: "0.82rem", color: "#888", marginTop: "2px", fontWeight: "600", letterSpacing: "0.5px" }}>
                                {key.toUpperCase()}: {val}
                             </p>
                          ))}
                        </div>
                      </div>

                      <div className="item-price">
                        {currSym}{price.toFixed(2)}
                      </div>

                      <div className="item-quantity">
                        <div className="qty-controls">
                          <button 
                            disabled={updatingId === item._id || item.quantity <= 1} 
                            onClick={() => onUpdateQuantity(item._id, item.quantity, -1)}
                          ><Minus size={14}/></button>
                          <span>{item.quantity}</span>
                          <button 
                            disabled={updatingId === item._id} 
                            onClick={() => onUpdateQuantity(item._id, item.quantity, 1)}
                          ><Plus size={14}/></button>
                        </div>
                      </div>

                      <div className="item-subtotal">
                        {currSym}{itemSubtotal.toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="cart-actions-bottom">
                <div className="coupon-box">
                  <input type="text" placeholder="Coupon Code" />
                  <button className="btn-apply-coupon">Apply Coupon</button>
                </div>
                <button className="btn-clear-cart" onClick={onClear}>Clear Shopping Cart</button>
              </div>

              {/* Added Features Row */}
              <div className="features-row">
                <div className="feature-item">
                  <FaShippingFast size={32} className="feature-icon" />
                  <div>
                    <h5>Free Shipping</h5>
                    <p>Free shipping for order above $180</p>
                  </div>
                </div>
                <div className="feature-item">
                  <FaCreditCard size={32} className="feature-icon" />
                  <div>
                    <h5>Flexible Payment</h5>
                    <p>Multiple secure payment options</p>
                  </div>
                </div>
                <div className="feature-item">
                  <FaHeadset size={32} className="feature-icon" />
                  <div>
                    <h5>24x7 Support</h5>
                    <p>We support online all days.</p>
                  </div>
                </div>
              </div>

            </div>

            <div className="cart-right">
              <div className="order-summary-card">
                <h3>Order Summary</h3>
                <div className="summary-row">
                  <span>Items</span>
                  <span>{items.reduce((acc, curr) => acc + curr.quantity, 0)}</span>
                </div>
                <div className="summary-row">
                  <span>Sub Total</span>
                  <span>{currSym}{subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{currSym}{shipping.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Taxes</span>
                  <span>{currSym}{taxes.toFixed(2)}</span>
                </div>
                <div className="summary-row discount">
                  <span>Coupon Discount</span>
                  <span>-{currSym}0.00</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{currSym}{total.toFixed(2)}</span>
                </div>

                <button className="btn-proceed-checkout">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Checkout;
