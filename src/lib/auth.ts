
"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { createUserProfile, updateUserLastLogin } from "./firebase/firestore";


export const signUp = async (email: string, password: string, additionalData: Record<string, any> = {}) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Update Firebase Auth user profile
  await updateProfile(user, {
    displayName: additionalData.name || "",
  });

  // Create user profile in Firestore
  await createUserProfile(user, additionalData);
  
  return user;
};

export const signIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  await updateUserLastLogin(userCredential.user.uid);
  return userCredential.user;
};

export const signOut = async () => {
  await firebaseSignOut(auth);
};

export const passwordReset = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};
