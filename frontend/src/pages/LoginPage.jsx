import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await login(formData.email, formData.password);
    if (res.success) {
      navigate('/');
    } else {
      alert(res.error || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-banner auth-banner-login">
          <h2>Welcome Back.</h2>
          <p>Sign in to access your curated collection, saved orders, and exclusive deals.</p>
        </div>
        
        <div className="auth-form-side">
          <div className="auth-header">
            <h1>Shop<span>Smart</span></h1>
            <p>Welcome back! Sign in to continue.</p>
          </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
          </div>
          <div className="auth-row">
            <label className="checkbox-label"><input type="checkbox" /> Remember me</label>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
          <button type="submit" className="btn btn-cta-cart auth-submit">Sign In</button>
        </form>
        <p className="auth-switch">Don't have an account? <Link to="/register">Create one</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
