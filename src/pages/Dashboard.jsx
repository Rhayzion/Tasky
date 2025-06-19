// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, updateDoc, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Tabs from '../components/Tabs';
import TaskSection from '../components/TaskSection';
import AIChatBot from '../components/AIChatBot';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('tasks');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth?mode=signin');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      const fetchUserProfile = async () => {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        } else {
          const profileData = {
            displayName: user.displayName || null,
            email: user.email,
            avatarUrl: user.photoURL || null,
            createdAt: new Date(),
            settings: { theme: 'dark', notifications: true },
          };
          await setDoc(doc(db, 'users', user.uid), profileData);
          setUserProfile(profileData);
        }
      };
      fetchUserProfile();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const tasksData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log('Fetched tasks:', tasksData); // Debug log
        setTasks(tasksData);
      }, (error) => {
        console.error('onSnapshot error:', error);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleAddTask = async (title, category, dueTime = '') => {
    try {
      const newTask = {
        userId: user.uid,
        title,
        status: 'todo',
        dueDate: category === 'today' ? new Date().toISOString().split('T')[0] : '',
        dueTime,
        category,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      console.log('Adding task:', newTask); // Debug log
      const docRef = await addDoc(collection(db, 'tasks'), newTask);
      console.log('Task added with ID:', docRef.id);
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const handleUpdateTask = async (taskId, newStatus) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        status: newStatus,
        updatedAt: new Date(),
      });
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div className="dashboard-container">
      <Header userProfile={userProfile} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <main className="dashboard-main">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <TaskSection
          activeTab={activeTab}
          tasks={tasks}
          handleAddTask={handleAddTask}
          handleUpdateTask={handleUpdateTask}
          handleDeleteTask={handleDeleteTask}
        />
      </main>
      <AIChatBot />
    </div>
  );
};

export default Dashboard;