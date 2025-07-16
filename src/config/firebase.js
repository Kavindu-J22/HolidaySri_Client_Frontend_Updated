import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBR-NezPY1dMOeag71109GzaBbv05x5YUY",
  authDomain: "holidaysri-da15a.firebaseapp.com",
  projectId: "holidaysri-da15a",
  storageBucket: "holidaysri-da15a.firebasestorage.app",
  messagingSenderId: "545415964771",
  appId: "1:545415964771:web:e8c0c2325046bea4553056",
  measurementId: "G-M0D7T4MPWV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
