// src/components/TaskSection.jsx
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import TaskCard from './TaskCard';
import TaskTimeModal from './TaskTimeModal';
import '../styles/TaskSection.css';

const TaskSection = ({ activeTab, tasks, handleAddTask, handleUpdateTask, handleDeleteTask }) => {
  const [taskInput, setTaskInput] = useState('');
  const [activeView, setActiveView] = useState('today');
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [newTaskId, setNewTaskId] = useState(null);

  const views = [
    { id: 'today', label: 'Today' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'routine', label: 'Routine' },
    { id: 'focus', label: 'Focus Mode' },
  ];

  const filteredTasks = tasks.filter((task) => {
    console.log('Filtering task:', task); // Debug log
    if (activeTab === 'tasks' && task.status === 'todo') {
      return task.category === activeView;
    }
    return activeTab === 'completed' ? task.status === 'completed' : task.status === 'missed';
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    try {
      const newTask = {
        userId: auth.currentUser.uid,
        title: taskInput,
        status: 'todo',
        dueDate: activeView === 'today' ? new Date().toISOString().split('T')[0] : '',
        dueTime: '',
        category: activeView,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const docRef = await addDoc(collection(db, 'tasks'), newTask);
      setNewTaskId(docRef.id);
      setShowTimeModal(true);
      setTaskInput('');
    } catch (err) {
      console.error('Error adding task in TaskSection:', err);
    }
  };

  const handleSetTime = async (taskId, time) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        dueTime: time,
        updatedAt: new Date(),
      });
      setShowTimeModal(false);
      setNewTaskId(null);
    } catch (err) {
      console.error('Error setting time:', err);
    }
  };

  const handleSkipTime = () => {
    setShowTimeModal(false);
    setNewTaskId(null);
  };

  return (
    <section className="task-section">
      {activeTab === 'tasks' && (
        <nav className="sub-tabs">
          {views.map(({ id, label }) => (
            <button
              key={id}
              className={`sub-tab-button ${activeView === id ? 'active' : ''}`}
              onClick={() => setActiveView(id)}
              aria-label={label}
            >
              {label}
            </button>
          ))}
        </nav>
      )}
      <form className="task-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Add a new task..."
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          aria-label="New task"
        />
        <button type="submit" className="add-button" aria-label="Add task">
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </form>
      <div className="task-grid">
        <AnimatePresence>
          {filteredTasks.length ? (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                handleUpdateTask={handleUpdateTask}
                handleDeleteTask={handleDeleteTask}
              />
            ))
          ) : (
            <motion.p
              className="no-tasks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              No tasks yet. Add one to start!
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      {showTimeModal && (
        <TaskTimeModal
          taskId={newTaskId}
          onSetTime={handleSetTime}
          onSkip={handleSkipTime}
        />
      )}
    </section>
  );
};

export default TaskSection;