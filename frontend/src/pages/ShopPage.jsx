import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ListFilter, Heart, ShoppingBag, Star, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import productsData from '../assets/products.json';
import './ShopPage.css';

const ShopPage = () => {
  const [products, setProducts] = useState(productsData);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  const [selectedCategory, setSelectedCategory] = useState('');
  const { addItem } = useCart();
  const [limit, setLimit] = useState(12);

  useEffect(() => {
    const fetchProducts = async () => {
      let data = [];
      try {
        const res = await axios.get('/api/products');
        data = res.data;
      } catch (error) {
        console.log('Backend not active, using dummy data fallback for ShopPage');
        data = productsData;
      }
      
      let filtered = data;
      if (searchQuery) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      if (selectedCategory) {
        filtered = filtered.filter(p => p.category === selectedCategory);
      }
      setProducts(filtered);
    };
    fetchProducts();
  }, [searchQuery, selectedCategory]);

  return (
    <div className="shop-page container">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/">Home</Link> <ChevronRight size={12} /> <span>Shop</span>
      </div>

      <div className="shop-layout">
        {/* Sidebar Filters */}
        <aside className="shop-sidebar">
          <div className="filter-card">
            <div className="filter-header">
              <h3>Filters</h3>
              <button className="reset-btn" onClick={() => setSelectedCategory('')}>Reset All</button>
            </div>
            
            <div className="filter-section">
              <h4>CATEGORY</h4>
              <div className="filter-list">
                <label className={`filter-item ${selectedCategory==='' ? 'active' : ''}`}>
                  <input type="radio" name="cat" checked={selectedCategory===''} onChange={() => setSelectedCategory('')} />
                  <span>All Collections</span>
                </label>
                {['Electronics', 'Fashion', 'Sports', 'Home'].map(cat => (
                  <label key={cat} className={`filter-item ${selectedCategory===cat ? 'active' : ''}`}>
                    <input type="radio" name="cat" checked={selectedCategory===cat} onChange={() => setSelectedCategory(cat)} />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4>PRICE RANGE</h4>
              <div className="price-slider-container">
                <input type="range" min="0" max="5000" step="100" className="price-slider" />
                <div className="price-labels">
                  <span>$0</span>
                  <span>$5,000</span>
                </div>
              </div>
            </div>

            <div className="filter-section">
              <h4>BRAND</h4>
              <div className="filter-list">
                {['Apple', 'Samsung', 'Sony', 'Nike'].map(brand => (
                  <label key={brand} className="filter-item checkbox">
                    <input type="checkbox" />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4>RATINGS</h4>
              <div className="rating-filters">
                {[4, 3, 2].map(rating => (
                  <label key={rating} className="filter-item rating">
                    <input type="radio" name="rating" />
                    <div className="stars-row">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < rating ? "#fbbf24" : "none"} color={i < rating ? "#fbbf24" : "#d1d5db"} />
                      ))}
                      <span>& Up</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="shop-main">
          <div className="shop-header">
            <div className="shop-title-area">
              <h1>Explore Collections</h1>
              <p>{products.length} products found</p>
            </div>
            <div className="shop-controls">
              <div className="shop-sort">
                <span>Sort by:</span>
                <select>
                  <option>Popularity</option>
                  <option>Newest Arrivals</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          <div className="shop-products-grid">
            {products.slice(0, limit).map(product => (
              <div key={product.id} className="shop-product-card">
                <div className="shop-img-wrapper">
                  {product.isNew && <span className="new-tag">NEW</span>}
                  <Link to={`/product/${product._id || product.id}`}>
                    <img src={product.image} alt={product.name} />
                  </Link>
                  <div className="hover-actions">
                    <button className="h-btn"><Heart size={18} /></button>
                    <button onClick={() => addItem({...product, id: product.id || product._id, qty: 1})} className="h-btn active"><ShoppingBag size={18} /></button>
                  </div>
                </div>
                <div className="shop-product-info">
                  <p className="s-brand">{product.brand}</p>
                  <h3><Link to={`/product/${product._id || product.id}`}>{product.name}</Link></h3>
                  <div className="s-rating">
                    <Star size={12} fill="#fbbf24" color="#fbbf24" />
                    <span>{product.rating}</span>
                  </div>
                  <p className="s-price">${product.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          {limit < products.length && (
            <div className="shop-load-more">
               <button onClick={() => setLimit(l => l + 12)} className="load-btn">
                 Load More Products
               </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ShopPage;
