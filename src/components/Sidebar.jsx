// src/components/Sidebar.jsx
import React from 'react';
import { motion } from 'framer-motion';
import '../styles/Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <motion.aside
      className={`sidebar ${isOpen ? 'open' : ''}`}
      initial={{ x: -240 }}
      animate={{ x: isOpen ? 0 : -240 }}
      transition={{ duration: 0.3 }}
    >
      <div className="sidebar-content">
        <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
          {isOpen ? 'Close' : 'Open'}
        </button>
        <nav className="sidebar-nav">
          <h3>Navigation</h3>
          <ul>
            <li><a href="#" className="nav-link">Projects (Coming Soon)</a></li>
            <li><a href="#" className="nav-link">Settings (Coming Soon)</a></li>
          </ul>
        </nav>
      </div>
    </motion.aside>
  );
};

export default Sidebar;