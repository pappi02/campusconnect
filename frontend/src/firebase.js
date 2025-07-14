// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDqLUMVbmfVDSmXT2VjvF4LXK52yNCmJmE",
  authDomain: "campusdelivery-8513e.firebaseapp.com",
  projectId: "campusdelivery-8513e",
  storageBucket: "campusdelivery-8513e.firebasestorage.app",
  messagingSenderId: "981776681757",
  appId: "1:981776681757:web:3b5cf1be7e5dede5382ff4",
  measurementId: "G-Y3VYT5RVSX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider).then(result => result.user);
};

const signInWithFacebook = () => {
  return signInWithPopup(auth, facebookProvider).then(result => result.user);
};

export { auth, googleProvider, facebookProvider, signInWithGoogle, signInWithFacebook };
