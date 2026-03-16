import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import './AuthPages.css';

// forgot password page
const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: hook up to backend
    console.log('reset link sent to:', email);
    setSent(true);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            <KeyRound size={48} color="#2563eb" />
          </div>
          <h1>Reset your password</h1>
          <p>Enter your email and we'll send you a reset link.</p>
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
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <button type="submit" className="btn btn-cta-cart auth-submit">
              Send Reset Link 📨
            </button>
            <Link to="/login" className="auth-switch" style={{ display: 'block', textAlign: 'center' }}>
              ← Back to Login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
