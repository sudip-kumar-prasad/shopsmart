import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

// register page - wip
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    setIsLoading(true);
    try {
      const res = await register(formData.name, formData.email, formData.password);
      if (res.success) {
        navigate('/');
      } else {
        alert(res.error || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-banner auth-banner-register">
          <h2 className="banner-logo">ShopSmart</h2>
          <div className="banner-content">
            <h2>Elevate your daily shopping.</h2>
            <p>Join an exclusive community of smart shoppers who value quality, curation, and seamless experiences.</p>
          </div>
        </div>

        <div className="auth-form-side">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Start your curated shopping journey today.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                required
                minLength={6}
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                required
              />
            </div>
            <div className="auth-row" style={{ marginTop: '0.2rem', marginBottom: '0.5rem' }}>
              <label className="checkbox-label" style={{ alignItems: 'flex-start' }}>
                <input type="checkbox" required style={{ marginTop: '0.25rem' }} /> 
                <span style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>I agree to the <a href="#">Terms of Conditions</a> and <a href="#">Privacy Policy</a>.</span>
              </label>
            </div>
            <button type="submit" className="btn btn-cta-cart auth-submit" disabled={isLoading}>
              <div className="btn-content">
                {isLoading && <span className="spinner"></span>}
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </div>
            </button>
          </form>

          <div className="social-login-container">
            <div className="divider">
              <span>Or sign up with</span>
            </div>
            <div className="social-buttons">
              <button 
                type="button" 
                className="social-button google" 
                style={{ width: '100%' }}
                onClick={() => { window.location.href = 'http://localhost:5001/api/users/auth/google'; }}
              >
                <img src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="Google" width="18" height="18" />
                Sign up with Google
              </button>
            </div>
          </div>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
