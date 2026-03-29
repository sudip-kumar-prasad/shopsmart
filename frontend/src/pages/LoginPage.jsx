import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: 'admin@example.com', password: 'password123' });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await login(formData.email, formData.password);
      if (res.success) {
        navigate(redirectPath);
      } else {
        alert(res.error || 'Login failed. Please check credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Shop<span>Smart</span></h1>
          <p>Welcome back to your curated space.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <div className="label-row">
              <label>Password</label>
              <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
            </div>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
          </div>
          <div className="auth-row" style={{ marginTop: '-0.5rem' }}>
            <label className="checkbox-label"><input type="checkbox" /> Remember me</label>
          </div>
          <button type="submit" className="btn btn-cta-cart auth-submit" disabled={isLoading}>
            <div className="btn-content">
              {isLoading && <span className="spinner"></span>}
              {isLoading ? 'Signing In...' : 'Sign In'}
            </div>
          </button>
        </form>

        <div className="social-login-container">
          <div className="divider">
            <span>Or continue with</span>
          </div>
          <div className="social-buttons">
            <button 
              type="button" 
              className="social-button google" 
              style={{ width: '100%' }}
              onClick={() => { window.location.href = '/api/users/auth/google'; }}
            >
              <img src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="Google" width="18" height="18" />
              Continue with Google
            </button>
          </div>
        </div>
        
        <p className="auth-switch">Don't have an account? <Link to="/register">Sign up</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;
