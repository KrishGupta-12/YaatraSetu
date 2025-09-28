
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from "firebase/firestore";

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

// Enable offline persistence
try {
    enableIndexedDbPersistence(db, {
        cacheSizeBytes: CACHE_SIZE_UNLIMITED
    })
    .catch((err) => {
        if (err.code == 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled
            // in one tab at a a time.
            console.warn('Firestore offline persistence failed: multiple tabs open.');
        } else if (err.code == 'unimplemented') {
            // The current browser does not support all of the
            // features required to enable persistence
             console.warn('Firestore offline persistence not available in this browser.');
        }
    });
} catch(e) {
    console.error("Error enabling firestore persistence", e);
}


export { app, auth, db };
