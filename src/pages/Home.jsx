// src/pages/Auth.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { useLocation } from 'react-router-dom';
import '../styles/Auth.css';

const Auth = () => {
  const location = useLocation();
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Set initial mode based on query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const modeParam = params.get('mode');
    if (modeParam === 'signup' || modeParam === 'signin' || modeParam === 'reset') {
      setMode(modeParam);
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccess('Welcome to Tasky’s flow! Please sign in to start.');
        setMode('signin');
      } else if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccess('Signed in! Ready to power up your productivity.');
      } else if (mode === 'reset') {
        await sendPasswordResetEmail(auth, email);
        setSuccess('Password reset email sent! Check your inbox to continue with Tasky.');
      }
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message.replace('Firebase: ', '')); // Cleaner error messages
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getTitle = () => {
    switch (mode) {
      case 'signup':
        return 'Join Tasky’s Productivity Revolution';
      case 'reset':
        return 'Reset Your Tasky Password';
      default:
        return 'Welcome Back to Tasky';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'signup':
        return 'Sign up to organize tasks, boost focus, and unlock insights with LumosAI.';
      case 'reset':
        return 'Enter your email to reset your password and get back to Tasky.';
      default:
        return 'Sign in to access your tasks, habits, and AI-driven productivity tools.';
    }
  };

  return (
    <div className="auth-wrapper">
      <motion.section
        className="auth-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.div
          className="auth-container"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="auth-brand">
            <h2 className="auth-logo">Tasky</h2>
            <span className="auth-tagline">Powered by LumosAI</span>
          </div>
          <h1 className="auth-title">{getTitle()}</h1>
          <p className="auth-subtitle">{getSubtitle()}</p>
          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              className="auth-form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
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
                    className="toggle-icon"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={0}
                    onKeyPress={(e) => e.key === 'Enter' && togglePasswordVisibility()}
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
                  >
                    {success}
                  </motion.p>
                )}
              </AnimatePresence>
              <button type="submit" className="cta-button primary">
                {mode === 'signup' ? 'Sign Up' : mode === 'reset' ? 'Send Reset Email' : 'Sign In'}
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
                  Forgot your password?
                </button>
              </>
            )}
            {mode === 'signup' && (
              <button className="link-button" onClick={() => switchMode('signin')}>
                Already have a Tasky account? Sign in
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