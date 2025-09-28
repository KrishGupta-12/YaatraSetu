
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
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
        await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
    } catch (error) {
        console.error("Error updating last login timestamp:", error);
    }
}
