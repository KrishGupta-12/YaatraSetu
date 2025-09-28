
import { doc, setDoc, getDoc, serverTimestamp, updateDoc, deleteDoc, onSnapshot, arrayUnion, arrayRemove } from "firebase/firestore";
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

export const getUserProfile = (uid: string, onReceive: (data: any) => void) => {
    if (!uid) return () => {};
    const userRef = doc(db, `users/${uid}`);
    
    const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
            onReceive(doc.data());
        } else {
            onReceive(null);
        }
    });

    return unsubscribe;
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

export const addSavedPassenger = async (uid: string, passengerData: any) => {
  if (!uid) throw new Error("User ID is required to add a passenger.");
  const userRef = doc(db, `users/${uid}`);
  try {
    // arrayUnion ensures that the same passenger is not added multiple times if they are identical objects
    await updateDoc(userRef, {
      savedPassengers: arrayUnion(passengerData),
    });
  } catch (error) {
    console.error("Error adding saved passenger:", error);
    throw new Error("Unable to add passenger.");
  }
}

export const removeSavedPassenger = async (uid: string, passengerData: any) => {
  if (!uid) throw new Error("User ID is required to remove a passenger.");
  const userRef = doc(db, `users/${uid}`);
  try {
    await updateDoc(userRef, {
      savedPassengers: arrayRemove(passengerData),
    });
  } catch (error) {
    console.error("Error removing saved passenger:", error);
    throw new Error("Unable to remove passenger.");
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

