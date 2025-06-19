// src/components/Tabs.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faCheckCircle, faClock } from '@fortawesome/free-solid-svg-icons';
import '../styles/Tabs.css';

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'tasks', label: 'Tasks', icon: faTasks },
    { id: 'completed', label: 'Completed', icon: faCheckCircle },
    { id: 'missed', label: 'Missed', icon: faClock },
  ];

  return (
    <nav className="tabs">
      {tabs.map(({ id, label, icon }) => (
        <button
          key={id}
          className={`tab-button ${activeTab === id ? 'active' : ''}`}
          onClick={() => setActiveTab(id)}
          aria-label={label}
        >
          <FontAwesomeIcon icon={icon} /> {label}
        </button>
      ))}
    </nav>
  );
};

export default Tabs;