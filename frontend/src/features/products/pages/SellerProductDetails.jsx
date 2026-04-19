import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { getProductById, addProductVariant } from "../service/product.api";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Plus,
  Image as ImageIcon,
  MoreVertical,
  Loader,
  Info,
  ArrowLeft,
} from "lucide-react";
import { getCurrencySymbol } from "../../../utils/currency";

const SellerProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Variant Add Modal State
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [newVariant, setNewVariant] = useState({
    stock: 0,
    priceAmount: "",
    priceCurrency: "INR",
    size: "M",
    color: "Default",
  });
  const [variantImages, setVariantImages] = useState([]);
  const [addingVariant, setAddingVariant] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await getProductById(id);

      if (res.success) {
        setProduct(res.product);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch product");
    } finally {
      setLoading(false);
    }
  };

  const handleAddVariant = async (e) => {
    e.preventDefault();
    try {
      setAddingVariant(true);
      const formData = new FormData();
      formData.append("stock", newVariant.stock);
      formData.append(
        "priceAmount",
        newVariant.priceAmount || product.price.amount,
      );
      formData.append(
        "priceCurrency",
        newVariant.priceCurrency || product.price.currency,
      );

      const attributes = {
        Size: newVariant.size,
        Color: newVariant.color,
      };
      formData.append("attributes", JSON.stringify(attributes));

      variantImages.forEach((file) => {
        formData.append("images", file);
      });

      const res = await addProductVariant(id, formData);
      if (res.success) {
        setProduct(res.product); // Update with new variants
        setShowVariantModal(false);
        setVariantImages([]);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error adding variant");
    } finally {
      setAddingVariant(false);
    }
  };

  if (loading) {
    return (
      <div className="seller-product-details loading">
        <Loader className="spin" size={48} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="seller-product-details error">
        <h2>{error || "Product not found"}</h2>
        <button
          onClick={() => navigate("/seller/dashboard")}
          className="btn-outline"
        >
          Go Back
        </button>
      </div>
    );
  }

  const basePrice = product.price?.amount || 0;
  const currency = getCurrencySymbol(product.price?.currency || "INR");

  return (
    <div className="seller-product-details">
      {/* Header */}
      <header className="spd-header">
        <div
          className="header-left"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <button
            className="btn-outline"
            onClick={() => navigate("/seller/dashboard")}
            style={{
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              width: "fit-content",
              opacity: "0.8",
            }}
          >
            <ArrowLeft size={16} /> GO BACK
          </button>
          <div className="status-badge" style={{ alignSelf: "flex-start" }}>
            <span className="dot active"></span> ACTIVE
          </div>
          <span className="product-id">
            ID: {product._id?.substring(0, 10).toUpperCase()}
          </span>
          <h1 className="product-title">{product.title.toUpperCase()}</h1>
        </div>
        <div className="header-actions">
          <button className="btn-outline">EDIT PRODUCT</button>
          <button
            className="btn-outline"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            VIEW ON SITE
          </button>
        </div>
      </header>

      {/* Metrics Block */}
      <section className="spd-metrics">
        <div className="metric-card">
          <span className="label">TOTAL SALES</span>
          <div className="metric-value">
            <span className="value">$12,480</span>
            <span className="trend positive">+12%</span>
          </div>
        </div>
        <div className="metric-card">
          <span className="label">VIEWS</span>
          <div className="metric-value">
            <span className="value">1.2k</span>
            <span className="trend neutral">Last 30d</span>
          </div>
        </div>
        <div className="metric-card">
          <span className="label">CONVERSION RATE</span>
          <div className="metric-value">
            <span className="value">3.4%</span>
            <span className="trend positive">Above Avg</span>
          </div>
        </div>
      </section>

      <div className="spd-layout">
        {/* Main Content */}
        <div className="spd-main">
          {/* Media Gallery */}
          <section className="spd-section media-gallery">
            <div className="section-header">
              <h2>MEDIA GALLERY</h2>
              <button className="btn-text accent">
                <Plus size={16} /> UPLOAD ASSETS
              </button>
            </div>
            <div className="gallery-grid">
              {product.images?.map((img, i) => (
                <div key={i} className="gallery-item">
                  <img src={img.url || img} alt={`Product ${i}`} />
                </div>
              ))}
              <div className="gallery-item empty">
                <ImageIcon size={32} />
                <span>DROP IMAGE</span>
              </div>
            </div>
          </section>

          {/* Inventory Management */}
          <section className="spd-section inventory">
            <div className="section-header">
              <h2>INVENTORY MANAGEMENT</h2>
              <div className="header-actions">
                <button
                  className="btn-text accent"
                  onClick={() => setShowVariantModal(true)}
                >
                  <Plus size={16} /> ADD VARIANT
                </button>
                <div className="dropdown">
                  <span>Bulk Actions</span>
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>VARIANT</th>
                    <th>SKU</th>
                    <th>PRICE</th>
                    <th>STOCK</th>
                    <th>STATUS</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants?.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-state">
                        No variants added yet.
                      </td>
                    </tr>
                  ) : (
                    product.variants?.map((variant, i) => {
                      const vCurrency = getCurrencySymbol(
                        variant.price?.currency || product.price?.currency,
                      );
                      const vPrice = variant.price?.amount || basePrice;
                      const attrKeys = variant.attributes
                        ? Object.keys(variant.attributes)
                        : [];
                      const variantName =
                        attrKeys.length > 0
                          ? attrKeys
                              .map((k) => variant.attributes[k])
                              .join(" / ")
                          : `Variant ${i + 1}`;

                      let statusBadge = "";
                      let statusClass = "";
                      if (variant.stock <= 0) {
                        statusBadge = "OUT";
                        statusClass = "danger";
                      } else if (variant.stock < 15) {
                        statusBadge = "LOW";
                        statusClass = "warning";
                      } else {
                        statusBadge = "IN STOCK";
                        statusClass = "success";
                      }

                      return (
                        <tr key={variant._id || i}>
                          <td>
                            <div className="variant-cell">
                              <input type="checkbox" />
                              <span>{variantName}</span>
                            </div>
                          </td>
                          <td className="sku-cell">
                            PRN-
                            {variant._id?.substring(0, 4).toUpperCase() ||
                              "DEF"}
                          </td>
                          <td className="price-cell">
                            {vCurrency}
                            {vPrice}
                          </td>
                          <td>
                            <div className="stock-input">
                              <input
                                type="number"
                                defaultValue={variant.stock}
                                readOnly
                              />
                            </div>
                          </td>
                          <td>
                            <span className={`status-label ${statusClass}`}>
                              {statusBadge}
                            </span>
                          </td>
                          <td>
                            <button className="icon-btn">
                              <MoreVertical size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="spd-sidebar">
          <section className="spd-section specs">
            <h2>SPECS & DETAILS</h2>

            <div className="form-group">
              <label>CATEGORY</label>
              <div className="select-wrapper">
                <select
                  defaultValue={product.category?.[0] || "Short Sleeve Shirts"}
                >
                  <option>
                    {product.category?.[0] || "Short Sleeve Shirts"}
                  </option>
                  <option>Long Sleeve Shirts</option>
                  <option>Pants</option>
                </select>
                <ChevronDown size={16} className="arrow" />
              </div>
            </div>

            <div className="form-group">
              <label>DESCRIPTION</label>
              <textarea defaultValue={product.description} rows="4"></textarea>
            </div>

            <div className="tech-specs">
              <label>TECHNICAL SPECIFICATIONS</label>
              <div className="specs-grid">
                <div className="spec-item">
                  <span className="spec-label">MATERIAL</span>
                  <span className="spec-value">Organic Linen</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">FIT</span>
                  <span className="spec-value">Relaxed Boxy</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">WEIGHT</span>
                  <span className="spec-value">140 GSM</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">ORIGIN</span>
                  <span className="spec-value">Portugal</span>
                </div>
              </div>
            </div>

            <button className="btn-outline full-width">
              <Plus size={16} /> VIEW CHANGE LOG
            </button>
          </section>

          {/* Stock Alert */}
          {product.variants?.some((v) => v.stock < 15 && v.stock >= 0) && (
            <div className="stock-alert-panel">
              <h3>STOCK ALERT</h3>
              <p>
                One or more variants are currently below the safety threshold.
                Re-order suggested within 48 hours.
              </p>
              <button className="btn-black">RESTOCK NOW</button>
            </div>
          )}
        </aside>
      </div>

      {/* Basic Variant Add Modal */}
      {showVariantModal && (
        <div className="modal-overlay">
          <div className="modal-content dark">
            <h2>Add New Variant</h2>
            <form onSubmit={handleAddVariant}>
              <div className="form-group">
                <label>Color</label>
                <input
                  type="text"
                  value={newVariant.color}
                  onChange={(e) =>
                    setNewVariant({ ...newVariant, color: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Size</label>
                <input
                  type="text"
                  value={newVariant.size}
                  onChange={(e) =>
                    setNewVariant({ ...newVariant, size: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input
                  type="number"
                  value={newVariant.stock}
                  onChange={(e) =>
                    setNewVariant({ ...newVariant, stock: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Price ({currency})</label>
                <input
                  type="number"
                  placeholder="Leave empty for base price"
                  value={newVariant.priceAmount}
                  onChange={(e) =>
                    setNewVariant({
                      ...newVariant,
                      priceAmount: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setVariantImages(Array.from(e.target.files))}
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setShowVariantModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary accent-bg"
                  disabled={addingVariant}
                >
                  {addingVariant ? "Adding..." : "Add Variant"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProductDetails;
