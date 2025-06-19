// src/components/AIChatBot.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import '../styles/AIChatBot.css';

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="ai-chat-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open AI chat"
      >
        <FontAwesomeIcon icon={faCommentDots} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="ai-chat-modal"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="ai-chat-content">
              <h3>AI Assistant</h3>
              <p>Chat with Tasky’s AI coming soon...</p>
              <button onClick={() => setIsOpen(false)} className="close-button">
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatBot;