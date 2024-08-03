import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };


