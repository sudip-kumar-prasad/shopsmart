import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Heart, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';


// We'll hardcode the category cards to match the specific masonry layout


const featuredProducts = [
  { id: 101, name: 'Acoustic Pro Headphones', brand: 'BLUE TRENDS', price: 299.0, bg: 'linear-gradient(to bottom right, #51543d, #27281c)', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400' },
  { id: 102, name: 'Essential Timepiece', brand: 'ACCESSORIES', price: 185.0, bg: '#000000', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400' },
  { id: 103, name: 'Cognac Leather Tote', brand: 'FASHION', price: 420.0, bg: '#f1f5f9', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=400' },
  { id: 104, name: 'Veloce Runner', brand: 'SPORTS', price: 145.0, bg: 'linear-gradient(to bottom right, #1a1a1a, #300f0f)', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400' },
];

const HomePage = () => {
  const [featured, setFeatured] = useState(featuredProducts);
  const [trendingProduct, setTrendingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();

  const handleAddToCart = (product) => {
    if (!user) {
      navigate('/login?redirect=/');
      return;
    }
    addItem(product);
  };

  const handleScroll = (dir) => {
    const grid = document.querySelector('.featured-section .products-grid');
    if (grid) {
      grid.scrollBy({ left: dir === 'next' ? 300 : -300, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('/api/products');
        
        try {
          const { data: trendingData } = await axios.get('/api/products/trending');
          if (trendingData && trendingData.length > 0) {
            setTrendingProduct(trendingData[0]);
          }
        } catch (tErr) {
          console.warn('Failed to fetch trending product', tErr);
        }
        // Take first 8 as featured so there are items to scroll through
        if (data && data.length >= 4) {
          const latestProducts = data.slice(0, 8).map((p, i) => ({
            id: p._id,
            name: p.name,
            brand: p.brand,
            price: p.price,
            bg: featuredProducts[i % 4].bg, // retain the stylistic bg from UI design
            image: p.image
          }));
          setFeatured(latestProducts);
        }
      } catch (err) {
        console.log('Backend not active, using default featured layout');
      }
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section container">
        <div className="hero-container">
          <div className="hero-content">
            <span className="hero-badge">SUMMER COLLECTION 2024</span>
            <h1>Define Your<br/>Modern<br/>Style.</h1>
            <p>Curated selections from global artisans, delivered with the precision your lifestyle demands.</p>
            <div className="hero-btns">
              <button onClick={() => navigate('/shop')} className="btn btn-primary-orange">Shop New Arrivals</button>
              <button onClick={() => navigate('/shop')} className="btn btn-secondary-white">View Lookbook</button>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-placeholder">
              {/* Placeholder image that looks like the empty graphic icon in the design */}
              <div className="placeholder-icon" style={{width: '100%', height: '100%', borderRadius: '1rem', overflow: 'hidden'}}>
                <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1000" alt="Hero Fashion" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              </div>
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
        <div className="categories-masonry">
          {/* Electronics - Square */}
          <div className="category-card cat-electronics">
            <div className="category-info">
              <div className="category-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 14.899A7 7 0 1 1 20 14.9V19a2 2 0 0 1-2 2h-1.5a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h1.5M4 14.9V19a2 2 0 0 0 2 2h1.5a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H6"/></svg></div>
              <h3>Electronics</h3>
              <p>Next-gen performance tools.</p>
            </div>
          </div>

          {/* Fashion - Wide Rectangle */}
          <div className="category-card cat-fashion">
            <div className="category-info">
              <div className="category-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"/></svg></div>
              <h3>Fashion</h3>
              <p>Sustainable, timeless apparel.</p>
            </div>
          </div>

          {/* Home - Wide Rectangle */}
          <div className="category-card cat-home">
            <div className="category-info">
              <div className="category-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
              <h3>Home</h3>
              <p>Art for the living space.</p>
            </div>
          </div>

          {/* Sports - Square */}
          <div className="category-card cat-sports">
            <div className="category-info">
              <div className="category-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="2" x2="12" y2="22"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10"/><path d="M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10"/></svg></div>
              <h3>Sports</h3>
              <p>High-end athletic gear.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section container section">
        <div className="section-header">
          <h2>Featured Products</h2>
          <div className="scroll-btns">
            <button onClick={() => handleScroll('prev')} className="scroll-btn prev">‹</button>
            <button onClick={() => handleScroll('next')} className="scroll-btn next">›</button>
          </div>
        </div>
        <div className="products-grid">
          {featured.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-img-wrapper" style={{ background: product.bg }}>
                <img src={product.image} alt={product.name} />
                <div className="product-actions">
                  <button onClick={() => alert('Added to Wishlist!')} className="action-btn"><Heart size={18} /></button>
                  <button onClick={() => handleAddToCart({...product, id: product.id || product._id, qty: 1})} className="action-btn"><ShoppingBag size={18} /></button>
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
            <button onClick={() => navigate('/shop')} className="btn btn-primary trending-all-btn">
              View All Trending <ArrowRight size={16} />
            </button>
          </div>
          <div className="trending-main-image">
            {trendingProduct ? (
              <>
                 <div className="trending-rating-badge" style={{ zIndex: 2 }}>
                    <span className="rating-score">{trendingProduct.rating || 4.5}/5</span>
                    <span className="rating-label">AVERAGE RATING</span>
                 </div>
                 <img 
                   src={trendingProduct.image} 
                   alt={trendingProduct.name} 
                   onClick={() => navigate(`/product/${trendingProduct._id || trendingProduct.id}`)}
                   style={{ cursor: 'pointer' }}
                 />
                 {trendingProduct.totalQtySold && (
                   <div style={{ position: 'absolute', top: '2rem', right: '2rem', background: '#f97316', color: 'white', padding: '0.5rem 1rem', borderRadius: '1rem', fontWeight: 700, fontSize: '0.8rem', zIndex: 2 }}>
                     🔥 {trendingProduct.totalQtySold} BOUGHT THIS WEEK
                   </div>
                 )}
              </>
            ) : (
              <>
                 <div className="trending-rating-badge">
                    <span className="rating-score">4.9/5</span>
                    <span className="rating-label">AVERAGE RATING</span>
                 </div>
                 <img src="https://images.unsplash.com/photo-1526170315870-ef6856fd3afd?auto=format&fit=crop&q=80&w=800" alt="Main Trending" />
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
