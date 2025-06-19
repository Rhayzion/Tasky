// src/components/TaskCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';
import '../styles/TaskCard.css';

const TaskCard = ({ task, handleUpdateTask, handleDeleteTask }) => {
  return (
    <motion.div
      className="task-card"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <button
        className="mark-button"
        onClick={() => handleUpdateTask(task.id, task.status === 'completed' ? 'todo' : 'completed')}
        aria-label={`Mark ${task.title} as ${task.status === 'completed' ? 'incomplete' : 'complete'}`}
      >
        <FontAwesomeIcon
          icon={faCheck}
          className={`mark-icon ${task.status === 'completed' ? 'completed' : ''}`}
        />
      </button>
      <div className="task-content">
        <h3 className={`task-title ${task.status === 'completed' ? 'completed' : ''}`}>
          {task.title}
        </h3>
        {(task.dueDate || task.dueTime) && (
          <p className="task-due">
            Due: {task.dueDate} {task.dueTime ? `at ${task.dueTime}` : ''}
          </p>
        )}
      </div>
      <button
        className="delete-button"
        onClick={() => handleDeleteTask(task.id)}
        aria-label={`Delete ${task.title}`}
      >
        <FontAwesomeIcon icon={faTrash} className="delete-icon" />
      </button>
    </motion.div>
  );
};

export default TaskCard;