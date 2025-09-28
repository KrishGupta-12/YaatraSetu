
import { doc, setDoc, getDoc, serverTimestamp, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from "./config";
import type { User } from 'firebase/auth';

export const createUserProfile = async (user: User, additionalData: Record<string, any> = {}) => {
  if (!user) return;

  const userRef = doc(db, `users/${user.uid}`);
  const createdAt = serverTimestamp();

  // Consolidate data, ensuring values are not undefined
  const userData = {
    uid: user.uid,
    email: user.email || '',
    displayName: additionalData.name || user.displayName || '',
    photoURL: user.photoURL || '',
    phone: additionalData.phone || '',
    // Only set these on initial creation
    ...(!await getDoc(userRef).then(snap => snap.exists()) ? {
      createdAt: createdAt,
      savedPassengers: [],
      preferences: {},
      loyaltyPoints: 0,
    } : {})
  };

  try {
    // Use set with merge: true to create or update the document
    await setDoc(userRef, userData, { merge: true });
  } catch (error) {
    console.error("Error creating or updating user profile:", error);
    throw new Error("Unable to create or update user profile.");
  }
};

export const updateUserLastLogin = async (uid: string) => {
    if (!uid) return;
    const userRef = doc(db, `users/${uid}`);
    try {
        await updateDoc(userRef, { lastLogin: serverTimestamp() });
    } catch (error) {
        // This can fail if the document doesn't exist yet, which is okay on first login.
        // createUserProfile will handle creating it.
        if (error instanceof Error && 'code' in error && error.code !== 'not-found') {
             console.error("Error updating last login timestamp:", error);
        }
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
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const currentPassengers = docSnap.data().savedPassengers || [];
      const updatedPassengers = [...currentPassengers, passengerData];
      await updateDoc(userRef, {
        savedPassengers: updatedPassengers,
      });
    } else {
        throw new Error("User profile does not exist.");
    }
  } catch (error) {
    console.error("Error adding saved passenger:", error);
    throw new Error("Unable to add passenger.");
  }
}

export const removeSavedPassenger = async (uid: string, passengerToRemove: any) => {
  if (!uid) throw new Error("User ID is required to remove a passenger.");
  const userRef = doc(db, `users/${uid}`);
  try {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
        const currentPassengers = docSnap.data().savedPassengers || [];
        const updatedPassengers = currentPassengers.filter((p: any) => p.id !== passengerToRemove.id);
        await updateDoc(userRef, {
            savedPassengers: updatedPassengers,
        });
    } else {
         throw new Error("User profile does not exist.");
    }
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
