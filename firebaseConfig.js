// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";  // Import Authentication
import { getFirestore } from "firebase/firestore";  // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBji3gthBvEjbWBj-gWPkupwHjLes5A2eg",
  authDomain: "pantry-c4605.firebaseapp.com",
  projectId: "pantry-c4605",
  storageBucket: "pantry-c4605.appspot.com",
  messagingSenderId: "233524027053",
  appId: "1:233524027053:web:adb773fe6991619a38b024",
  measurementId: "G-JBGPDG10Q1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);  // Initialize Authentication
const db = getFirestore(app);  // Initialize Firestore

export { auth, db };
