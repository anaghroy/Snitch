import React, { useEffect } from 'react';
import Header from '../../../components/Header/Header';
import { useProduct } from '../hook/useProduct';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Search, User, Heart, ShoppingBag, Truck, RotateCcw, Headset, CreditCard } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import cloth1 from "../../../assets/images/cloth-1.jpg"
import cloth2 from "../../../assets/images/cloth-2.jpg"
import model1 from "../../../assets/images/model1.jpg"
import model2 from "../../../assets/images/model2.jpg"
import model3 from "../../../assets/images/model3.jpg"

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import lightLogo from "../../../assets/images/light-logo.png";

const HERO_IMAGES = [
  model1,
  model2,
  model3,
];

const Home = () => {
  const { handleGetAllProducts } = useProduct();
  const allProducts = useSelector((state) => state.product.allProducts);
  const navigate = useNavigate();

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  return (
    <div className="home-container">
      {/* Top Banner */}
      <div className="top-banner">
        Free shipping on all U.S. orders $50+
      </div>

      {/* Navigation Header */}
      <Header />

      <main>
        {/* Full Screen Hero Swiper */}
        <section className="hero-section">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ type: 'progressbar' }}
            loop={true}
            className="hero-swiper"
          >
            {HERO_IMAGES.map((img, i) => (
              <SwiperSlide key={i}>
                <div className="hero-slide" style={{ backgroundImage: `url(${img})`, backgroundPosition: 'center', backgroundSize: 'cover'}}>
                  <div className="hero-overlay">
                    <div className="hero-content">
                      <span className="subtitle">ESSENTIAL ITEMS</span>
                      <h1>Beauty Inspired<br/>by Real Life</h1>
                      <p>Made using clean, non-toxic ingredients, our products<br/>are designed for everyone.</p>
                      <button className="btn-shop-now">Shop Now</button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* Featured Products Swiper Category */}
        <section className="featured-section">
          <div className="section-header">
            <h2>Our Featured Products</h2>
            <p>Get the skin you want to feel</p>
          </div>

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
          >
            {allProducts?.map((product) => {
              const imgSource = product.images?.[0]?.url || product.images?.[0];
              const price = product.price?.amount || product.priceAmount || 0;
              const currency = product.price?.currency === 'USD' || product.priceCurrency === 'USD' ? '$' : '₹';

              return (
                <SwiperSlide key={product._id} onClick={() => navigate(`/product/${product._id}`)} style={{cursor: 'pointer'}}>
                  <div className="product-card">
                    <div className="product-img-wrapper">
                      {imgSource ? (
                        <img src={imgSource} alt={product.title} />
                      ) : (
                        <span>No Image</span>
                      )}
                      {/* Dummy sale tags for presentation */}
                      <span className="sale-tag">-{Math.floor(Math.random() * 50) + 10}%</span>
                    </div>
                    <div className="product-info">
                      <div className="product-price">{currency} {price}</div>
                      <div className="product-name">{product.title}</div>
                      <div className="product-rating">★★★★☆</div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </section>

        {/* Promo Banners */}
        <section className="promo-banners">
          <div className="promo-banner left">
            <span className="subtitle">NEW COLLECTION</span>
            <h3>Intensive Glow C+<br/>Serum</h3>
            <button className="btn-promo">Explore More</button>
            <img 
              src={cloth1}
              alt="Serum" 
              className="bg-img" 
            />
          </div>
          
          <div className="promo-banner right">
            <h3>25% off Everything</h3>
            <p>Makeup with extended range in<br/>colors for every human.</p>
            <button className="btn-promo">Shop Sale</button>
            <img 
              src={cloth2}
              alt="Makeup" 
              className="bg-img" 
            />
          </div>
        </section>

        {/* Features Grid */}
        <section className="features-section">
          <div className="feature-item">
            <div className="icon-wrapper"><Truck size={36} strokeWidth={1} /></div>
            <h4>Free Shipping</h4>
            <p>Free Shipping for orders over $130</p>
          </div>
          <div className="feature-item">
            <div className="icon-wrapper"><RotateCcw size={36} strokeWidth={1} /></div>
            <h4>Returns</h4>
            <p>Within 30 days for an exchange</p>
          </div>
          <div className="feature-item">
            <div className="icon-wrapper"><Headset size={36} strokeWidth={1} /></div>
            <h4>Online Support</h4>
            <p>24 hours a day, 7 days a week</p>
          </div>
          <div className="feature-item">
            <div className="icon-wrapper"><CreditCard size={36} strokeWidth={1} /></div>
            <h4>Flexible Payment</h4>
            <p>Pay with Multiple Credit Cards</p>
          </div>
        </section>

        {/* As Seen In */}
        <section className="as-seen-in">
          <h3>As seen in</h3>
          <div className="brands-grid">
            <div className="brand-col">
              <div className="brand-logo" style={{fontFamily: "var(--font-heading)"}}>Parker <br/> &Co.</div>
              <p className="quote">Also the customer service is phenomenal. I would purchase again.</p>
            </div>
            <div className="brand-col">
              <div className="brand-logo" style={{fontFamily: "var(--font-sub-heading)", letterSpacing: "0.1em", textTransform: "uppercase"}}>HAYDEN</div>
              <p className="quote">Great product line. Very attentive staff to deal with.</p>
            </div>
            <div className="brand-col">
              <div className="brand-logo" style={{fontFamily: "var(--font-main-heading)", fontWeight: 800}}>GOOD <br/> MOOD</div>
              <p className="quote">Looking to affordably upgrade your everyday dinnerware? Look no further than e-Space</p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Home;