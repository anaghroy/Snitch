import React from 'react';
import { useNavigate } from 'react-router';
import cloth1 from "../../../assets/images/Men's.jpg";
import cloth2 from "../../../assets/images/Women's.jpg";
import model1 from "../../../assets/images/Activewear.jpg";
import model2 from "../../../assets/images/Streetwear.jpg";
import model3 from "../../../assets/images/Premium.jpg";

const MYNTRA_CATEGORIES = [
  {
    id: 1,
    title: "Men's Casual Wear",
    discount: "40-80% OFF",
    img: model1,
    query: "men"
  },
  {
    id: 2,
    title: "Women's Western",
    discount: "50-80% OFF",
    img: model2,
    query: "women"
  },
  {
    id: 3,
    title: "Activewear",
    discount: "30-70% OFF",
    img: model3,
    query: "activewear"
  },
  {
    id: 4,
    title: "Streetwear",
    discount: "40-80% OFF",
    img: cloth1,
    query: "men"
  },
  {
    id: 5,
    title: "Premium Essentials",
    discount: "30-80% OFF",
    img: cloth2,
    query: "women"
  }
];

const ShopByCategory = () => {
  const navigate = useNavigate();

  return (
    <section className="shop-by-category-section">
      <div className="section-header-left">
        <h2>SHOP BY CATEGORY</h2>
      </div>
      
      <div className="category-grid">
        {MYNTRA_CATEGORIES.map((cat) => (
          <div 
            className="category-card" 
            key={cat.id}
            onClick={() => navigate(`/search?category=${cat.query}`)}
          >
            <div className="img-wrapper">
              <img src={cat.img} alt={cat.title} />
            </div>
            <div className="card-info-box">
              <span className="cat-title">{cat.title}</span>
              <span className="cat-discount">{cat.discount}</span>
              <span className="cat-shop">Shop Now</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShopByCategory;
