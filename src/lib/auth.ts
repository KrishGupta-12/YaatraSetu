
"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { createUserProfile, updateUserLastLogin, deleteUserProfile, updateUserProfile } from "./firebase/firestore";


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
  const user = userCredential.user;
  // Ensure user profile exists and update last login
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

export const reauthenticate = async (password: string) => {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error("No user is signed in.");
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
};

export const changePassword = async (newPassword: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("No user is signed in.");
    await updatePassword(user, newPassword);
};

export const deleteCurrentUser = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("No user is signed in.");

    const userId = user.uid;
    // Delete from Firebase Auth
    await deleteUser(user);
    // Delete from Firestore
    await deleteUserProfile(userId);
};

export const updateUserPhoto = async (photoURL: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user is signed in.");
  
  // Update Firebase Auth
  await updateProfile(user, { photoURL });
  
  // Update Firestore
  await updateUserProfile(user.uid, { photoURL });
};
