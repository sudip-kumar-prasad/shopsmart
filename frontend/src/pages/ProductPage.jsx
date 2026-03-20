import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Truck, RotateCcw, Plus, Minus } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import productsData from '../assets/products.json';
import './ProductPage.css';

const relatedProducts = [
  { id: 11, name: 'Pro Case Ltd Edition', price: 89.0, image: 'https://images.unsplash.com/photo-1608156639585-34052e35a962?auto=format&fit=crop&q=80&w=400', label: 'CASE' },
  { id: 12, name: 'NuPhone 15 Pro', price: 1099.0, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400', label: 'PHONE' },
  { id: 13, name: 'QuickCharge Stand', price: 89.0, image: 'https://images.unsplash.com/photo-1583394293884-b32c35b3c8a5?auto=format&fit=crop&q=80&w=400', label: 'CHARGER' },
  { id: 14, name: 'AmpFlow Pro DAC', price: 349.0, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400', label: 'AUDIO' },
];

const reviews = [
  { id: 1, name: 'Jillian B.', rating: 5, date: '06.11.2023', text: "The best noise cancelling I've ever experienced. I use them daily for my morning commute and the battery seems to last forever. Definitely worth the premium price tag." },
  { id: 2, name: 'Marcus R.', rating: 5, date: '14.10.2023', text: "Incredible sound profile. It handles deep bass, crisp highs with ease. Vocal clarity is unmatched in this price range. The build quality here truly feels robust and premium." },
];

const ProductPage = () => {
  const { id } = useParams();
  
  // Fallback to dummy data immediately on mount just in case
  const fallbackProduct = productsData.find(p => p.id === parseInt(id) || p._id === id) || productsData[0];
  const [product, setProduct] = useState(fallbackProduct);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleBuyNow = () => {
    addToCart({...product, id: product.id || product._id}, qty);
    navigate('/checkout');
  };

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setSelectedImg(0); // reset image for new product
      } catch (error) {
        console.log('Backend not active, using dummy data fallback for ProductPage');
      }
    };
    fetchProduct();
    window.scrollTo(0,0);
  }, [id]);

  const thumbnails = [
    product.image,
    'https://images.unsplash.com/photo-1583394293884-b32c35b3c8a5?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1608156639585-34052e35a962?auto=format&fit=crop&q=80&w=200',
  ];

  return (
    <div className="product-page container">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/">Home</Link> / <Link to="/shop">Electronics</Link> / <span>{product.name}</span>
      </div>

      {/* Main Product Section */}
      <div className="product-layout">
        {/* Gallery */}
        <div className="product-gallery">
          <div className="thumbnails">
            {thumbnails.map((img, i) => (
              <button
                key={i}
                className={`thumb-btn ${selectedImg === i ? 'active' : ''}`}
                onClick={() => setSelectedImg(i)}
              >
                <img src={img} alt={`View ${i + 1}`} />
              </button>
            ))}
          </div>
          <div className="main-image">
            <img src={thumbnails[selectedImg]} alt={product.name} />
            <button onClick={() => alert('Added to Wishlist!')} className="wishlist-btn"><Heart size={20} /></button>
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info-panel">
          <span className="product-brand-tag">NEW ARRIVAL</span>
          <h1>{product.name}</h1>

          <div className="product-rating-row">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill={i < Math.floor(product.rating) ? '#fbbf24' : 'none'} color="#fbbf24" />
              ))}
            </div>
            <span className="rating-count">{product.rating} ({product.numReviews} Reviews)</span>
          </div>

          <div className="product-price-block">
            <span className="current-price">${product.price.toLocaleString()}</span>
            <span className="original-price">${(product.price * 1.15).toFixed(2)}</span>
          </div>

          <p className="product-description">
            Experience pure luxury with the {product.name}. Featuring cutting-edge noise cancellation, an ergonomic design, and premium materials. Hand-crafted within our custom-built facilities providing unparalleled comfort for extended listening sessions.
          </p>

          <div className="qty-selector">
            <label>Quantity</label>
            <div className="qty-controls">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}><Minus size={16} /></button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q + 1)}><Plus size={16} /></button>
            </div>
          </div>

          <div className="product-ctas">
            <button onClick={() => addToCart({...product, id: product.id || product._id}, qty)} className="btn btn-cta-cart"><ShoppingBag size={18} /> Add to Cart</button>
            <button onClick={handleBuyNow} className="btn btn-cta-buy">Buy It Now</button>
          </div>

          <div className="product-guarantees">
            <div className="guarantee-item">
              <Truck size={18} />
              <span>Free &amp; Fast Delivery</span>
            </div>
            <div className="guarantee-item">
              <RotateCcw size={18} />
              <span>2 Year Warranty</span>
            </div>
          </div>

          {/* Quality Highlights */}
          <div className="quality-block">
            <h3>Uncompromising Quality</h3>
            <div className="quality-tabs">
              <div className="quality-tab active">
                <strong>Sonic Precision</strong>
                <p>Dual 40mm drivers for ultra-fine resolution and extraordinary dynamic range in your music experience.</p>
              </div>
              <div className="quality-tab blue">
                <span className="highlight-stat">40H</span>
                <p>Listening time on a single charge, 5-minute instant charge for 2 hours of music.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="reviews-section section">
        <div className="reviews-header">
          <h2>User Voices</h2>
          <button onClick={() => alert('Review portal opening soon!')} className="btn btn-secondary">Write a Review</button>
        </div>
        <div className="reviews-layout">
          <div className="rating-summary">
            <span className="big-rating">{product.rating}</span>
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill={i < Math.floor(product.rating) ? '#fbbf24' : 'none'} color="#fbbf24" />
              ))}
            </div>
            <p>{product.numReviews} Reviews</p>
          </div>
          <div className="review-cards">
            {reviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div>
                    <strong>{review.name}</strong>
                    <span className="review-date">Verified Buyer</span>
                  </div>
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < review.rating ? '#fbbf24' : 'none'} color="#fbbf24" />
                    ))}
                  </div>
                </div>
                <p>{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pairs Perfectly With */}
      <section className="pairs-section section">
        <h2>Pairs Perfectly With</h2>
        <div className="pairs-grid">
          {relatedProducts.map(item => (
            <div key={item.id} className="pair-card">
              <div className="pair-img">
                <img src={item.image} alt={item.name} />
                {item.label && <span className="pair-label">{item.label}</span>}
              </div>
              <h4>{item.name}</h4>
              <p>${item.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
