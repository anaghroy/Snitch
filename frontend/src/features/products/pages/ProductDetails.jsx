import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
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
  const navigate = useNavigate();
  const { handleGetProductById, handleGetSimilarProducts } = useProduct();
  const { handleAddToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [addingToCart, setAddingToCart] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  
  // Variant States
  const [selectedAttributes, setSelectedAttributes] = useState({});

  useEffect(() => {
    async function fetchProduct() {
      if (id) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
        
        try {
          const similar = await handleGetSimilarProducts(id);
          setSimilarProducts(similar);
        } catch (e) {
          console.error("Failed to fetch similar products:", e);
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

          <div className="add-to-cart-form" style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "2rem" }}>
            <div className="quantity-controls" style={{ display: "flex", border: "1px solid #ddd", height: "45px", backgroundColor: "#fff" }}>
              <button 
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                style={{ padding: "0 15px", background: "transparent", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "#333", borderRight: "1px solid #ddd" }}
              >-</button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                style={{ width: "50px", textAlign: "center", border: "none", outline: "none", height: "100%", padding: "0" }}
              />
              <button 
                type="button"
                onClick={() => setQuantity(q => q + 1)}
                style={{ padding: "0 15px", background: "transparent", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "#333", borderLeft: "1px solid #ddd" }}
              >+</button>
            </div>
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

      {/* Similar Products Section */}
      {similarProducts && similarProducts.length > 0 && (
        <div className="similar-products-section" style={{ marginTop: "4rem", borderTop: "1px solid #f0f0f0", paddingTop: "3rem" }}>
          <h2 style={{ textAlign: "center", marginBottom: "2rem", fontSize: "1.8rem", textTransform: "uppercase", letterSpacing: "1px" }}>You May Also Like</h2>
          
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={30}
            slidesPerView={4}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 }
            }}
            className="product-swiper"
            style={{ padding: "10px 0 40px" }}
          >
            {similarProducts.map((prod) => {
              const imgSource = prod.images?.[0]?.url;
              const prodPrice = prod.price?.amount || 0;
              const prodCurrency = getCurrencySymbol(prod.price?.currency);

              return (
                <SwiperSlide key={prod._id} onClick={() => navigate(`/product/${prod._id}`)} style={{cursor: 'pointer'}}>
                  <div className="product-card" style={{ transition: "all 0.3s ease" }}>
                    <div className="product-img-wrapper" style={{ overflow: "hidden", position: "relative", paddingBottom: "130%", backgroundColor: "#f9f9f9" }}>
                      {imgSource ? (
                        <img src={imgSource} alt={prod.title} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }} />
                      ) : (
                        <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>No Image</span>
                      )}
                    </div>
                    <div className="product-info" style={{ marginTop: "15px", textAlign: "center" }}>
                      <div className="product-price" style={{ fontWeight: "600", marginBottom: "5px" }}>{prodCurrency} {prodPrice.toFixed(2)}</div>
                      <div className="product-name" style={{ fontSize: "0.95rem", color: "#666", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", padding: "0 10px" }}>{prod.title}</div>
                      <div className="product-rating" style={{ fontSize: "0.8rem", color: "#000", marginTop: "5px" }}>★★★★☆</div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
