import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Truck, RotateCcw, Plus, Minus } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import Skeleton from '../components/Skeleton';
import productsData from '../assets/products.json';
import './ProductPage.css';

const relatedProducts = [
  { id: 11, name: 'Pro Case Ltd Edition', price: 89.0, image: 'https://images.unsplash.com/photo-1608156639585-34052e35a962?auto=format&fit=crop&q=80&w=400', label: 'CASE' },
  { id: 12, name: 'NuPhone 15 Pro', price: 1099.0, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400', label: 'PHONE' },
  { id: 13, name: 'QuickCharge Stand', price: 89.0, image: 'https://images.unsplash.com/photo-1583394293884-b32c35b3c8a5?auto=format&fit=crop&q=80&w=400', label: 'CHARGER' },
  { id: 14, name: 'AmpFlow Pro DAC', price: 349.0, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400', label: 'AUDIO' },
];

const ProductPage = () => {
  const { id } = useParams();
  
  // Fallback to dummy data immediately on mount just in case
  const fallbackProduct = productsData.find(p => p.id === parseInt(id) || p._id === id) || productsData[0];
  const [product, setProduct] = useState(fallbackProduct);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loadingReview, setLoadingReview] = useState(false);
  const [errorReview, setErrorReview] = useState(null);

  const { addItem } = useCart();
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!user) {
      navigate(`/login?redirect=/product/${id}`);
      return;
    }
    addItem({...product, id: product.id || product._id, qty});
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate(`/login?redirect=/product/${id}`);
      return;
    }
    addItem({...product, id: product.id || product._id, qty});
    navigate('/checkout');
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    setLoadingReview(true);
    setErrorReview(null);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/products/${id}/reviews`, { rating, comment }, config);
      setProduct(data.product);
      setRating(0);
      setComment('');
      setShowReviewForm(false);
      toast.success('Review submitted successfully!');
    } catch (error) {
      const msg = error.response && error.response.data.message ? error.response.data.message : error.message;
      setErrorReview(msg);
      toast.error(msg);
    } finally {
      setLoadingReview(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setSelectedImg(0); // reset image for new product
      } catch (error) {
        console.log('Backend not active, using dummy data fallback for ProductPage');
      }
      setTimeout(() => setIsLoading(false), 800);
    };
    fetchProduct();
    window.scrollTo(0,0);
  }, [id]);

  const thumbnails = product.images && product.images.length >= 3 ? product.images : [
    product.image,
    product.image,
    product.image
  ];

  if (isLoading) {
    return (
      <div className="product-page container">
        <div className="product-layout">
          <div className="product-gallery">
            <Skeleton height="500px" borderRadius="1.5rem" />
          </div>
          <div className="product-info-panel">
            <Skeleton width="100px" height="1rem" className="mb-4" />
            <Skeleton width="80%" height="3rem" className="mb-4" />
            <Skeleton width="40%" height="1.5rem" className="mb-4" />
            <Skeleton height="100px" className="mb-4" />
            <Skeleton height="50px" width="200px" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="product-page container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
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
            <button 
              className={`wishlist-btn ${product && isInWishlist(product._id || product.id) ? 'active' : ''}`}
              onClick={() => {
                toggleWishlist(product);
                if (!isInWishlist(product._id || product.id)) {
                  toast.success('Added to wishlist');
                }
              }}
            >
              <Heart size={20} fill={product && isInWishlist(product._id || product.id) ? "currentColor" : "none"} />
            </button>
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
            <span className="rating-count">{product.rating.toFixed(1)} ({product.numReviews} Reviews)</span>
          </div>

          <div className="price-tag">
            <span className="current-price">₹{product.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            <span className="original-price">₹{(product.price * 1.15).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            <span className="discount-badge">15% OFF</span>
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
            <button onClick={handleAddToCart} className="btn btn-cta-cart"><ShoppingBag size={18} /> Add to Cart</button>
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
              {product.qualityHighlights ? (
                product.qualityHighlights.map((highlight, index) => (
                  <div key={index} className={`quality-tab ${index === 1 ? 'blue' : 'active'}`}>
                    {highlight.title && <strong>{highlight.title}</strong>}
                    {highlight.highlightStat && <span className="highlight-stat">{highlight.highlightStat}</span>}
                    <p>{highlight.description}</p>
                  </div>
                ))
              ) : (
                <>
                  <div className="quality-tab active">
                    <strong>Default Benchmark</strong>
                    <p>Exceptional quality and reliability come standard with all our selections.</p>
                  </div>
                  <div className="quality-tab blue">
                    <span className="highlight-stat">100%</span>
                    <p>Guaranteed satisfaction from precision engineering.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="reviews-section section">
        <div className="reviews-header">
          <h2>User Voices</h2>
          <button 
            onClick={() => {
              if (!user) {
                navigate(`/login?redirect=/product/${id}`);
              } else {
                setShowReviewForm(!showReviewForm);
              }
            }} 
            className="btn btn-secondary"
          >
            {showReviewForm ? 'Cancel' : 'Write a Review'}
          </button>
        </div>

        {showReviewForm && (
          <motion.div 
            className="review-form-container"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h3>Share your experience</h3>
            <form onSubmit={submitReviewHandler} className="review-form">
              <div className="form-group">
                <label>Rating</label>
                <div className="star-selector">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      onMouseEnter={() => setRating(s)}
                      className="star-btn"
                    >
                      <Star
                        size={24}
                        fill={s <= rating ? '#fbbf24' : 'none'}
                        color={s <= rating ? '#fbbf24' : '#d1d5db'}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Your Review</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you like or dislike? How was the quality?"
                  required
                  rows="4"
                ></textarea>
              </div>
              {errorReview && <p className="error-message">{errorReview}</p>}
              <button type="submit" className="btn btn-primary" disabled={loadingReview}>
                {loadingReview ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          </motion.div>
        )}

        <div className="reviews-layout">
          <div className="rating-summary">
            <span className="big-rating">{product.rating.toFixed(1)}</span>
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill={i < Math.floor(product.rating) ? '#fbbf24' : 'none'} color="#fbbf24" />
              ))}
            </div>
            <p>{product.numReviews} Reviews</p>
          </div>
          <div className="review-cards">
            {(product.reviews && product.reviews.length > 0) ? (
              product.reviews.map((review, i) => (
                <motion.div 
                  key={review._id || i} 
                  className="review-card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="review-header">
                    <div>
                      <strong>{review.name}</strong>
                      <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()} • Verified Buyer
                      </span>
                    </div>
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < review.rating ? '#fbbf24' : 'none'} color="#fbbf24" />
                      ))}
                    </div>
                  </div>
                  <p>{review.comment || review.text}</p>
                </motion.div>
              ))
            ) : (
              <div style={{ padding: '2rem 1rem', background: '#f9fafb', borderRadius: '1rem', textAlign: 'center', gridColumn: 'span 2' }}>
                <p style={{ color: '#6b7280' }}>No reviews yet for this product. Be the first to share your thoughts!</p>
              </div>
            )}
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
              <p>₹{item.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

export default ProductPage;
