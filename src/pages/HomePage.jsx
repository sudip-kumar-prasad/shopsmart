import React from 'react';
import { ArrowRight, Star, Heart, ShoppingBag } from 'lucide-react';
import './HomePage.css';

const categories = [
  { id: 1, name: 'Electronics', icon: '🎧', color: '#f3f4f6' },
  { id: 2, name: 'Fashion', icon: '👗', color: '#fef3c7', image: 'https://images.unsplash.com/photo-1539109132314-34a959df99b3?auto=format&fit=crop&q=80&w=400' },
  { id: 3, name: 'Home', icon: '🏠', color: '#e0f2fe' },
  { id: 4, name: 'Sports', icon: '⚽', color: '#f5f3ff' },
];

const featuredProducts = [
  { id: 101, name: 'Acoustic Pro Headphones', brand: 'BLUE TRENDS', price: 299.0, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400' },
  { id: 102, name: 'Essential Timepiece', brand: 'ACCESSORIES', price: 185.0, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400' },
  { id: 103, name: 'Cognac Leather Tote', brand: 'FASHION', price: 420.0, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=400' },
  { id: 104, name: 'Veloce Runner', brand: 'SPORTS', price: 145.0, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400' },
];

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="hero-badge">SUMMER COLLECTION 2024</span>
            <h1>Define Your Modern Style.</h1>
            <p>Curated selections from global artisans, delivered with the precision your lifestyle demands.</p>
            <div className="hero-btns">
              <button className="btn btn-primary">Shop New Arrivals</button>
              <button className="btn btn-secondary">View Lookbook</button>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-placeholder">
              <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1000" alt="Hero" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section container section">
        <div className="section-header">
          <div>
            <h2>Browse by Category</h2>
            <p>Explore our curated collections of premium goods.</p>
          </div>
        </div>
        <div className="categories-grid">
          {categories.map(cat => (
            <div key={cat.id} className="category-card" style={{ backgroundColor: cat.color }}>
              <div className="category-info">
                <div className="category-icon">{cat.icon}</div>
                <h3>{cat.name}</h3>
                <p>Premium {cat.name.toLowerCase()} tools.</p>
              </div>
              {cat.image && <img src={cat.image} alt={cat.name} className="category-img" />}
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section container section">
        <div className="section-header">
          <h2>Featured Products</h2>
          <div className="scroll-btns">
            <button className="scroll-btn prev">‹</button>
            <button className="scroll-btn next">›</button>
          </div>
        </div>
        <div className="products-grid">
          {featuredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-img-wrapper">
                <img src={product.image} alt={product.name} />
                <div className="product-actions">
                  <button className="action-btn"><Heart size={18} /></button>
                  <button className="action-btn"><ShoppingBag size={18} /></button>
                </div>
              </div>
              <div className="product-info">
                <span className="product-brand">{product.brand}</span>
                <h3>{product.name}</h3>
                <p className="product-price">${product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Weekly */}
      <section className="trending-section container section">
        <div className="trending-container">
          <div className="trending-sidebar">
            <h2>Trending Weekly</h2>
            <p>Join the thousands who have already upgraded their essentials this week. Top-rated products based on utility and aesthetics.</p>
            <div className="trending-list">
              <div className="trending-item">
                <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=100" alt="Essential Watch" />
                <div>
                  <h4>Essential Watch</h4>
                  <span>#1 in Accessories • 4.9/5 Rating</span>
                </div>
              </div>
              <div className="trending-item">
                <img src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=100" alt="Organic Glow Serum" />
                <div>
                  <h4>Organic Glow Serum</h4>
                  <span>#2 in Beauty • 4.8/5 Rating</span>
                </div>
              </div>
            </div>
            <button className="btn btn-primary trending-all-btn">
              View All Trending <ArrowRight size={16} />
            </button>
          </div>
          <div className="trending-main-image">
             <div className="trending-rating-badge">
                <span className="rating-score">4.9/5</span>
                <span className="rating-label">AVERAGE RATING</span>
             </div>
             <img src="https://images.unsplash.com/photo-1526170315870-ef6856fd3afd?auto=format&fit=crop&q=80&w=800" alt="Main Trending" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
