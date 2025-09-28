
import { doc, setDoc, getDoc, serverTimestamp, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./config";
import type { User } from 'firebase/auth';

export const createUserProfile = async (user: User, additionalData: Record<string, any> = {}) => {
  if (!user) return;

  const userRef = doc(db, `users/${user.uid}`);
  const { email, displayName, photoURL } = user;
  const createdAt = serverTimestamp();

  try {
    await setDoc(userRef, {
      uid: user.uid,
      email,
      displayName: additionalData.name || displayName,
      photoURL,
      createdAt,
      lastLogin: createdAt,
      phone: additionalData.phone || "",
      savedPassengers: [],
      preferences: {},
      loyaltyPoints: 0,
    }, { merge: true });
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw new Error("Unable to create user profile.");
  }
};

export const updateUserLastLogin = async (uid: string) => {
    if (!uid) return;
    const userRef = doc(db, `users/${uid}`);
    try {
        await updateDoc(userRef, { lastLogin: serverTimestamp() });
    } catch (error) {
        console.error("Error updating last login timestamp:", error);
    }
}

export const getUserProfile = async (uid: string) => {
    if (!uid) return null;
    const userRef = doc(db, `users/${uid}`);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        return userSnap.data();
    }
    return null;
}

export const updateUserProfile = async (uid: string, data: Record<string, any>) => {
    if (!uid) return;
    const userRef = doc(db, `users/${uid}`);
    try {
        await updateDoc(userRef, data);
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw new Error("Unable to update user profile.");
    }
}

export const deleteUserProfile = async (uid: string) => {
    if (!uid) return;
    const userRef = doc(db, `users/${uid}`);
    try {
        await deleteDoc(userRef);
    } catch (error) {
        console.error("Error deleting user profile:", error);
        throw new Error("Unable to delete user profile.");
    }
}
