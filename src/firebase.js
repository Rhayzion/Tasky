
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config (safe to use in frontend apps)
const firebaseConfig = {  apiKey: "AIzaSyAW7N-JBE91bI1LMXpZ6Ln2p-ikAhsXgB8",
  authDomain: "tasky-8c585.firebaseapp.com",
  projectId: "tasky-8c585",
  storageBucket: "tasky-8c585.firebasestorage.app",
  messagingSenderId: "322427060675",
  appId: "1:322427060675:web:502dfe9e920b18846d3d76",
  measurementId: "G-731HMP2KQK"

};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);

// Request notification permission
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' });
      return token;
    } else {
      console.warn('Notification permission denied');
      return null;
    }
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return null;
  }
};

// Handle foreground messages
onMessage(messaging, (payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logos/tasky-icon.png', // Optional: Add your app icon
  };
  new Notification(notificationTitle, notificationOptions);
});
