// src/components/Header.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import '../styles/Header.css';

const Header = ({ userProfile }) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const initials = userProfile?.displayName?.slice(0, 2).toUpperCase() || userProfile?.email?.slice(0, 2).toUpperCase() || 'U';

  return (
    <header className="header">
      <div className="header-logo">
        <FontAwesomeIcon icon={faTasks} className="logo-icon" />
        Tasky
      </div>
      <div className="profile-menu">
        <button
          className="profile-avatar"
          onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          aria-label="Toggle profile menu"
        >
          {userProfile?.avatarUrl ? (
            <img src={userProfile.avatarUrl} alt="Profile" className="avatar-image" />
          ) : (
            <span>{initials}</span>
          )}
        </button>
        <AnimatePresence>
          {profileMenuOpen && (
            <motion.ul
              className="profile-dropdown"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <li>
                <button className="dropdown-item" disabled>
                  <FontAwesomeIcon icon={faUser} /> Profile
                </button>
              </li>
              <li>
                <button className="dropdown-item" onClick={() => signOut(auth)}>
                  <FontAwesomeIcon icon={faSignOutAlt} /> Sign Out
                </button>
              </li>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;