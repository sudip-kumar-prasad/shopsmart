import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import './AuthPages.css';

// forgot password page
const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('reset link sent to:', email);
      setSent(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ fontSize: '3rem', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: '#eff6ff', borderRadius: '50%', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <KeyRound size={32} color="#2563eb" />
            </div>
          </div>
          <h1>Reset your password</h1>
          <p style={{ marginTop: '0.5rem', lineHeight: '1.5' }}>Enter your email address and we'll send you a link to reset your password.</p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', color: '#16a34a' }}>
            <p>✅ Check your inbox! Reset link sent to <strong>{email}</strong></p>
            <Link to="/login" style={{ marginTop: '1rem', display: 'block', color: '#2563eb' }}>
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <button type="submit" className="btn btn-cta-cart auth-submit" style={{ marginTop: '1rem' }} disabled={isLoading}>
              <div className="btn-content">
                {isLoading && <span className="spinner"></span>}
                {isLoading ? 'Sending Link...' : 'Send Reset Link'}
              </div>
            </button>
            <Link to="/login" className="auth-switch" style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' }}>
              Wait, I remember my password
            </Link>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
