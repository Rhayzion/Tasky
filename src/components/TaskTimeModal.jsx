// src/components/TaskTimeModal.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/TaskTimeModal.css';

const TaskTimeModal = ({ taskId, onSetTime, onSkip }) => {
  const [time, setTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (time) {
      onSetTime(taskId, time);
    } else {
      onSkip();
    }
  };

  return (
    <motion.div
      className="time-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="time-modal"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <h3>Set Due Time</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            aria-label="Set due time"
          />
          <div className="modal-actions">
            <button type="submit" className="set-button">
              Set Time
            </button>
            <button type="button" className="skip-button" onClick={onSkip}>
              Skip
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default TaskTimeModal;