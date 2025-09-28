
"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  type Auth,
} from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { createUserProfile, updateUserLastLogin } from "./firebase/firestore";

const googleProvider = new GoogleAuthProvider();

export const signUp = async (email: string, password: string, additionalData: Record<string, any> = {}) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await createUserProfile(user, additionalData);
  return user;
};

export const signIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  await updateUserLastLogin(userCredential.user.uid);
  return userCredential.user;
};

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  await createUserProfile(user);
  await updateUserLastLogin(user.uid);
  return user;
};

export const signOut = async () => {
  await firebaseSignOut(auth);
};

export const passwordReset = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};
