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

  useEffect(() => {
    async function fetchProduct() {
      if (id) {
        const prod = await handleGetProductById(id);
        setProduct(prod);
      }
    }
    fetchProduct();
  }, [id]);

  const onAddToCart = async () => {
    if (!product || quantity < 1) return;
    setAddingToCart(true);
    try {
      await handleAddToCart(product._id, quantity);
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

  // Ensure arrays exist for UI mappings
  const images = product.images?.length > 0 ? product.images : [{ url: "" }];
  const price = product.price?.amount || 0;
  const currency = getCurrencySymbol(product.price?.currency);
  const categories = product.category?.join(", ") || "Uncategorized";
  const tag = product.brand || "None";

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
