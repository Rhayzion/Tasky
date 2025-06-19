// src/pages/Auth.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faArrowLeft, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState('signin'); // signup, signin, reset
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setLoading] = useState(false);

  // Set mode from query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const modeParam = params.get('mode');
    if (['signup', 'signin', 'reset'].includes(modeParam)) {
      setMode(modeParam);
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        // Create user profile in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          displayName: null,
          email: user.email,
          avatarUrl: null,
          createdAt: new Date(),
          settings: { theme: 'dark', notifications: true },
        });
        setSuccess('Account created! Redirecting to your dashboard...');
        setTimeout(() => navigate('/dashboard'), 2000);
      } else if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccess('Welcome back! Redirecting to your dashboard...');
        setTimeout(() => navigate('/dashboard'), 2000);
      } else if (mode === 'reset') {
        await sendPasswordResetEmail(auth, email);
        setSuccess('Password reset email sent! Check your inbox.');
      }
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setShowPassword(false);
  };

  return (
    <div className="auth-wrapper">
      <motion.section
        className="auth-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div className="auth-container">
          <div className="auth-brand">
            <h2 className="auth-logo">Tasky</h2>
            <p className="auth-tagline">Power Up Your Productivity</p>
          </div>
          <h1 className="auth-title">
            {mode === 'signup' ? 'Join Tasky' : mode === 'signin' ? 'Welcome Back' : 'Reset Password'}
          </h1>
          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              className="auth-form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="input-group">
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email"
                />
              </div>
              {mode !== 'reset' && (
                <div className="input-group">
                  <FontAwesomeIcon icon={faLock} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-label="Password"
                  />
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className="icon-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  />
                </div>
              )}
              <AnimatePresence>
                {error && (
                  <motion.p
                    className="error-message"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {error}
                  </motion.p>
                )}
                {success && (
                  <motion.p
                    className="success-message"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {success}
                  </motion.p>
                )}
              </AnimatePresence>
              <button type="submit" className="cta-button primary" disabled={isLoading}>
                {isLoading ? (
                  <FontAwesomeIcon icon={faEye} className="loading-icon" spin />
                ) : (
                  mode === 'signup' ? 'Sign Up' : mode === 'reset' ? 'Send Reset Email' : 'Sign In'
                )}
              </button>
            </motion.form>
          </AnimatePresence>
          <div className="auth-links">
            {mode === 'signin' && (
              <>
                <button className="link-button" onClick={() => switchMode('signup')}>
                  Create a Tasky account
                </button>
                <button className="link-button" onClick={() => switchMode('reset')}>
                  Forgot password?
                </button>
              </>
            )}
            {mode === 'signup' && (
              <button className="link-button" onClick={() => switchMode('signin')}>
                Already have an account? Sign in
              </button>
            )}
            {mode === 'reset' && (
              <button className="link-button" onClick={() => switchMode('signin')}>
                <FontAwesomeIcon icon={faArrowLeft} /> Back to Sign In
              </button>
            )}
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default Auth;