// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

// Firebase configuration with better fallback handling
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey && 
         !firebaseConfig.apiKey.includes('Dummy') && 
         firebaseConfig.apiKey !== 'undefined';
};

let app, auth, googleProvider, facebookProvider;

try {
  // Only initialize Firebase if we have a valid API key
  if (firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('Dummy')) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    facebookProvider = new FacebookAuthProvider();
  } else {
    console.warn('Firebase not configured - using fallback authentication');
    // Create mock objects to prevent errors
    auth = null;
    googleProvider = null;
    facebookProvider = null;
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  auth = null;
  googleProvider = null;
  facebookProvider = null;
}

const signInWithGoogle = () => {
  if (!auth || !googleProvider) {
    console.warn('Firebase not configured - Google sign-in unavailable');
    return Promise.reject(new Error('Firebase not configured'));
  }
  return signInWithPopup(auth, googleProvider).then(result => result.user);
};

const signInWithFacebook = () => {
  if (!auth || !facebookProvider) {
    console.warn('Firebase not configured - Facebook sign-in unavailable');
    return Promise.reject(new Error('Firebase not configured'));
  }
  return signInWithPopup(auth, facebookProvider).then(result => result.user);
};

export { auth, googleProvider, facebookProvider, signInWithGoogle, signInWithFacebook };
