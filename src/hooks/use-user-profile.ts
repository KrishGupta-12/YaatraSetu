
"use client";

import { useState, useEffect } from "react";
import { doc, onSnapshot, type DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "./use-auth";

export function useUserProfile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setProfileData(null);
      return;
    }

    setLoading(true);
    const userProfileRef = doc(db, `users/${user.uid}`);

    const unsubscribe = onSnapshot(
      userProfileRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        } else {
          console.log("No such document!");
          setProfileData(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching user profile:", err);
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [user]);

  return { profileData, loading, error };
}
