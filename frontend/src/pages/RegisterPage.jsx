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
    const res = await register(formData.name, formData.email, formData.password);
    if (res.success) {
      navigate('/');
    } else {
      alert(res.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-banner">
          <h2>Elevate your daily shopping.</h2>
          <p>Join thousands of shoppers who trust ShopSmart for their everyday purchases.</p>
        </div>

        <div className="auth-form-side">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Fill in the details below to get started.</p>
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
            <button type="submit" className="btn btn-cta-cart auth-submit">
              Create Account
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
