import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// This page handles the redirect from Google OAuth.
// It reads the user token from the URL, saves it to AuthContext, and redirects home.
const OAuthCallbackPage = () => {
  const [params] = useSearchParams();
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userParam = params.get('user');
    if (userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        loginWithToken(userData);
        navigate('/', { replace: true });
      } catch (e) {
        console.error('OAuth callback error', e);
        navigate('/login?error=oauth_failed', { replace: true });
      }
    } else {
      navigate('/login?error=oauth_failed', { replace: true });
    }
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Inter, sans-serif',
      fontSize: '1.1rem',
      color: '#64748b'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <p>Signing you in with Google...</p>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;
