
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "studio-2373155575-93e4f",
  appId: "1:610730367499:web:9c78065177f7b661ba850e",
  apiKey: "AIzaSyCVe1DidHl0sef5yKQWX9cHBXvwbi7ZpQk",
  authDomain: "studio-2373155575-93e4f.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "610730367499"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
