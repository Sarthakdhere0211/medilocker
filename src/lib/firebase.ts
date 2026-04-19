import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Replace with your real Firebase config from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAs-DEMO-API-KEY",
  authDomain: "medilocker-demo.firebaseapp.com",
  projectId: "medilocker-demo",
  storageBucket: "medilocker-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
