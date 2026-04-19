import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useProduct } from "../hook/useProduct";
import { useCart } from "../../cart/hook/useCart";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import { Heart, GitCompare } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import Header from "../../../components/Header/Header";
import LoadingLines from "../../../components/ui/LoadingLines";
import { getCurrencySymbol } from "../../../utils/currency";


import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

const ProductDetails = () => {
  const { id } = useParams();
  const { handleGetProductById } = useProduct();
  const { handleAddToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [addingToCart, setAddingToCart] = useState(false);
  
  // Variant States
  const [selectedAttributes, setSelectedAttributes] = useState({});

  useEffect(() => {
    async function fetchProduct() {
      if (id) {
        const prod = await handleGetProductById(id);
        setProduct(prod);
        
        // Auto-select base/original variant logic will happen naturally 
        // by defaulting to "Original" config if variants exist
        if (prod?.variants?.length > 0) {
           const initialAttrs = {};
           const keys = new Set();
           prod.variants.forEach(v => Object.keys(v.attributes || {}).forEach(k => keys.add(k)));
           keys.forEach(k => initialAttrs[k] = "Original");
           setSelectedAttributes(initialAttrs);
        }
      }
    }
    fetchProduct();
  }, [id]);

  // Combine base product and explicitly added variants into a unified searchable array
  const allVariants = React.useMemo(() => {
    if (!product || !product.variants || product.variants.length === 0) return [];

    const keys = new Set();
    product.variants.forEach(v => Object.keys(v.attributes || {}).forEach(k => keys.add(k)));

    const baseAttributes = {};
    keys.forEach(k => baseAttributes[k] = "Original");

    const baseVariant = {
      isBase: true,
      _id: product._id,
      images: product.images,
      price: product.price,
      stock: Infinity, // Base product stock fallback
      attributes: baseAttributes
    };

    return [baseVariant, ...product.variants];
  }, [product]);

  // Derived current variant from COMBINED array
  const selectedVariant = allVariants.find(v => {
    if (!v.attributes) return false;
    return Object.keys(selectedAttributes).every(k => v.attributes[k] === selectedAttributes[k]);
  });

  const availableStock = selectedVariant ? selectedVariant.stock : Infinity;

  const onAddToCart = async () => {
    if (!product || quantity < 1) return;
    if (quantity > availableStock) {
      alert(`Only ${availableStock} items available in stock!`);
      return;
    }

    setAddingToCart(true);
    try {
      const variantId = selectedVariant?.isBase ? 'base' : (selectedVariant?._id || 'base');
      await handleAddToCart(product._id, quantity, variantId, selectedAttributes);
      alert("Product added to cart successfully!");
    } catch (e) {
      alert("Failed to add to cart: " + e.message);
    } finally {
      setAddingToCart(false);
    }
  };

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "5rem" }}>
        <LoadingLines/>
      </div>
    );
  }

  // Ensure arrays exist for UI mappings. Prioritize variant specific images if available.
  const variantImages = selectedVariant?.images?.length > 0 ? selectedVariant.images : null;
  const images = variantImages || (product.images?.length > 0 ? product.images : [{ url: "" }]);
  
  // Override price if variant is selected
  const price = selectedVariant?.price?.amount || product.price?.amount || 0;
  const currency = getCurrencySymbol(selectedVariant?.price?.currency || product.price?.currency);
  const categories = product.category?.join(", ") || "Uncategorized";
  const tag = product.brand || "None";

  // Variant dynamic UI helpers
  const attributeKeys = allVariants.reduce((keys, v) => {
    Object.keys(v.attributes || {}).forEach(k => {
      if (!keys.includes(k)) keys.push(k);
    });
    return keys;
  }, []) || [];

  const getUniqueValues = (key) => {
     return Array.from(new Set(allVariants.map(v => v.attributes?.[key]).filter(Boolean)));
  };

  const handleAttributeSelect = (key, val) => {
    let nextVariant = allVariants.find(v => {
       const attrs = v.attributes || {};
       let isMatch = true;
       for (const currKey of Object.keys(selectedAttributes)) {
          if (currKey !== key && attrs[currKey] !== selectedAttributes[currKey]) isMatch = false;
       }
       return isMatch && attrs[key] === val;
    });

    if (!nextVariant) {
       nextVariant = allVariants.find(v => v.attributes?.[key] === val);
    }

    if (nextVariant) {
       setSelectedAttributes(nextVariant.attributes || {});
    }
  };

  return (
    <div className="product-details-container">
      {/* Reused Header */}
      <Header
        style={{
          boxShadow: "none",
          borderBottom: "1px solid #f0f0f0",
          marginBottom: "3rem",
        }}
      />

      <div className="main-product-area">
        {/* Left Side: Images Gallery */}
        <div className="product-gallery">
          <Swiper
            observer={true}
            observeParents={true}
            modules={[Navigation, Thumbs]}
            thumbs={{
              swiper:
                thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
            }}
            className="main-image"
          >
            {images.map((img, i) => (
              <SwiperSlide key={`main-${i}`}>
                {img.url ? (
                  <img src={img.url} alt={`${product.title} ${i}`} />
                ) : (
                  <span>No Image</span>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Thumbnails */}
          {images.length > 1 && (
            <Swiper
              observer={true}
              observeParents={true}
              modules={[Navigation, Thumbs]}
              onSwiper={setThumbsSwiper}
              navigation
              slidesPerView={4}
              spaceBetween={15}
              watchSlidesProgress
              className="thumbnails-swiper"
            >
              {images.map((img, i) => (
                <SwiperSlide key={`thumb-${i}`}>
                  {img.url ? (
                    <img src={img.url} alt={`thumb-${i}`} />
                  ) : (
                    <span>No Image</span>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        {/* Right Side: Information */}
        <div className="product-info">
          <div className="header-row">
            <h1>{product.title}</h1>
            <div className="nav-arrows">
              <span>{"<"}</span>
              <span>{">"}</span>
            </div>
          </div>

          <div className="reviews-line">
            <span className="stars">★★★★☆</span>
            <span className="count">(1 customer review)</span>
          </div>

          <div className="price">
            {currency}
            {price.toFixed(2)}
          </div>

          <div className="description">{product.description}</div>

          {/* Variant Selection UI */}
          {attributeKeys.length > 0 && (
            <div className="variant-selection" style={{ marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {attributeKeys.map(key => (
                <div key={key} className="attribute-group">
                  <strong style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>{key}</strong>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {getUniqueValues(key).map(val => {
                      const isSelected = selectedAttributes[key] === val;
                      return (
                        <button
                          key={val}
                          onClick={() => handleAttributeSelect(key, val)}
                          style={{
                            padding: "0.5rem 1.2rem",
                            border: `1px solid ${isSelected ? "#000" : "#ddd"}`,
                            background: isSelected ? "#000" : "#fff",
                            color: isSelected ? "#fff" : "#333",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                          }}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              
              {selectedVariant && (
                <div style={{ fontSize: "0.85rem", color: availableStock > 0 ? "green" : "red", marginTop: "0.5rem", fontWeight: "600" }}>
                  {availableStock > 0 ? `${availableStock} items in stock` : "Currently Out of Stock"}
                </div>
              )}
            </div>
          )}

          <div className="add-to-cart-form">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value) || 1)}
            />
            <button
              className="btn-add-cart"
              onClick={onAddToCart}
              disabled={addingToCart}
            >
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>
            <button className="btn-buy-now">
              BUY NOW
            </button>
          </div>

          <div className="actions-secondary">
            <button>
              <Heart size={16} /> Browse Wishlist
            </button>
            <button>
              <GitCompare size={16} /> Add to compare
            </button>
          </div>

          <div className="meta-info">
            <p>
              <strong>Categories:</strong> {categories}
            </p>
            <p>
              <strong>Tag:</strong> {tag}
            </p>
          </div>

          <div className="social-share">
            Share this product
            <div className="social-icons" style={{display: 'flex', gap: '15px'}}>
              <span style={{cursor: 'pointer'}}><FaFacebook size={16} /></span>
              <span style={{cursor: 'pointer'}}><FaTwitter size={16} /></span>
              <span style={{cursor: 'pointer'}}><FaInstagram size={16} /></span>
              <span style={{cursor: 'pointer'}}><FaLinkedin size={16} /></span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tabs */}
      <div className="tabs-section">
        <div className="tabs-header">
          <button
            className={activeTab === "description" ? "active" : ""}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button
            className={activeTab === "reviews" ? "active" : ""}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews (1)
          </button>
        </div>
        <div className="tab-content">
          {activeTab === "description" && (
            <div>
              <p>{product.description}</p>
              <p>
                Pellentesque aliquet, sem eget laoreet ultrices, ipsum metus
                feugiat sem, quis fermentum turpis eros eget velit. Donec ac
                tempus ante. Fusce ultricies massa massa. Fusce aliquam, purus
                eget sagittis vulputate, sapien libero hendrerit est, sed
                commodo augue nisi non neque. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Sed tempor, lorem et placerat
                vestibulum, metus nisi posuere nisl, in accumsan elit odio quis
                mi. Cras neque metus, consequat et blandit et, luctus a nunc.
                Etiam gravida vehicula tellus, in imperdiet ligula euismod eget.
              </p>
            </div>
          )}
          {activeTab === "reviews" && (
            <div>
              <p>
                There are no reviews yet. Be the first to review "
                {product.title}"!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
