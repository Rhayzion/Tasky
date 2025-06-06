import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheckCircle, faPlus, faRandom } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './App.css';

function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [category, setCategory] = useState('Personal');
  const [placeholderText, setPlaceholderText] = useState('');
  const inputRef = useRef(null);
  const sampleTasks = [
    'Finish report (Work)',
    'Call mom (Personal)',
    'Try yoga (Fun)',
    'Plan meeting (Work)',
    'Watch a movie (Fun)',
  ];

  // Dynamic placeholder animation
  useEffect(() => {
    let index = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentText = '';

    const typeEffect = () => {
      // Pause animation if input is focused
      if (inputRef.current === document.activeElement) {
        setTimeout(typeEffect, 50);
        return;
      }

      const currentTask = sampleTasks[index];
      if (!isDeleting) {
        // Typing
        currentText = currentTask.substring(0, charIndex + 1);
        setPlaceholderText(currentText);
        charIndex++;
        if (charIndex === currentTask.length) {
          isDeleting = true;
          setTimeout(typeEffect, 800); // Pause after typing
        } else {
          setTimeout(typeEffect, 80); // Typing speed
        }
      } else {
        // Deleting
        currentText = currentTask.substring(0, charIndex - 1);
        setPlaceholderText(currentText);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          index = (index + 1) % sampleTasks.length; // Next task
          setTimeout(typeEffect, 400); // Pause before next task
        } else {
          setTimeout(typeEffect, 40); // Deleting speed
        }
      }
    };

    const timer = setTimeout(typeEffect, 500);
    return () => clearTimeout(timer); // Cleanup
  }, []);

  // Handle input change
  const handleTaskInput = (event) => {
    setTask(event.target.value);
  };

  // Handle category change
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  // Handle form submission
  const handleAddTask = (event) => {
    event.preventDefault();
    if (task.trim() !== '') {
      setTasks([
        ...tasks,
        { id: Date.now(), text: task, completed: false, category },
      ]);
      setTask('');
    }
  };

  // Handle task deletion
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Handle task completion
  const handleToggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Fetch random activity from Bored API
  const handleFetchRandomTask = async () => {
    try {
      const response = await axios.get('https://www.boredapi.com/api/activity');
      const randomTask = response.data.activity;
      setTasks([
        ...tasks,
        { id: Date.now(), text: randomTask, completed: false, category: 'Fun' },
      ]);
    } catch (error) {
      console.error('Error fetching random activity:', error);
    }
  };

  return (
    <div className="container">
      <h1>My To-Do List</h1>
      <p>Todo list App like no other</p>
      <form onSubmit={handleAddTask}>
        <select value={category} onChange={handleCategoryChange}>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Fun">Fun</option>
        </select>
        <input
          type="text"
          value={task}
          placeholder={placeholderText}
          onChange={handleTaskInput}
          ref={inputRef}
        /> 
        <button type="submit" className="add-button">
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            <button
              className="complete-button"
              onClick={() => handleToggleComplete(task.id)}
            >
              <FontAwesomeIcon
                icon={faCheckCircle}
                className={task.completed ? 'completed-icon' : ''}
              />
            </button>
            <span className="task-text">{task.text}</span>
            <span className="category-label">{task.category}</span>
            <button
              className="delete-button"
              onClick={() => handleDeleteTask(task.id)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </li>
        ))}
      </ul>
      <button className="random-button" onClick={handleFetchRandomTask}>
        <FontAwesomeIcon icon={faRandom} />
        <span className="random-button-text">Random Task</span>
      </button>
    </div>
  );
}

export default App;