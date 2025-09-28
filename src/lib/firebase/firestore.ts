

import { doc, setDoc, getDoc, serverTimestamp, updateDoc, deleteDoc, collection, addDoc, onSnapshot, query, orderBy, where, runTransaction, getDocs, getCountFromServer, Timestamp } from "firebase/firestore";
import { db } from "./config";
import type { User } from 'firebase/auth';

export const createUserProfile = async (user: User, additionalData: Record<string, any> = {}) => {
  if (!user) return;

  const userRef = doc(db, `users/${user.uid}`);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    // Document doesn't exist, create it with all default fields
    const createdAt = serverTimestamp();
    try {
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email || '',
            displayName: additionalData.name || user.displayName || '',
            photoURL: user.photoURL || '',
            phone: additionalData.phone || '',
            createdAt: createdAt,
            lastLogin: createdAt,
            preferences: {},
            loyaltyPoints: 0,
            rewardsHistory: [],
        });
    } catch (error) {
        console.error("Error creating user profile:", error);
        throw new Error("Unable to create user profile.");
    }
  } else {
    // Document exists, just update last login
    try {
       await updateDoc(userRef, {
            lastLogin: serverTimestamp(),
       });
    } catch (error) {
        console.error("Error updating last login:", error);
    }
  }
};

export const updateUserLastLogin = async (uid: string) => {
    if (!uid) return;
    const userRef = doc(db, `users/${uid}`);
    try {
        await updateDoc(userRef, { lastLogin: serverTimestamp() });
    } catch (error) {
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
  const passengersCollectionRef = collection(db, `users/${uid}/passengers`);
  try {
    await addDoc(passengersCollectionRef, passengerData);
  } catch (error) {
    console.error("Error adding saved passenger:", error);
    throw new Error("Unable to add passenger.");
  }
}

export const removeSavedPassenger = async (uid: string, passengerId: string) => {
  if (!uid) throw new Error("User ID is required to remove a passenger.");
  const passengerDocRef = doc(db, `users/${uid}/passengers`, passengerId);
  try {
    await deleteDoc(passengerDocRef);
  } catch (error) {
    console.error("Error removing saved passenger:", error);
    throw new Error("Unable to remove passenger.");
  }
}

export const getSavedPassengers = (uid: string, onReceive: (data: any[]) => void) => {
    if (!uid) {
        onReceive([]);
        return () => {};
    };
    const passengersQuery = query(collection(db, `users/${uid}/passengers`));

    const unsubscribe = onSnapshot(passengersQuery, (querySnapshot) => {
        const passengers: any[] = [];
        querySnapshot.forEach((doc) => {
            passengers.push({ id: doc.id, ...doc.data() });
        });
        onReceive(passengers);
    }, (error) => {
        console.error("Error fetching saved passengers:", error);
        onReceive([]);
    });

    return unsubscribe;
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


export const getTatkalRequests = (uid: string, onReceive: (data: any[]) => void) => {
    if (!uid) {
        onReceive([]);
        return () => {};
    };
    const requestsQuery = query(
        collection(db, 'tatkal_requests'),
        where('userId', '==', uid)
    );

    const unsubscribe = onSnapshot(requestsQuery, (querySnapshot) => {
        const requests: any[] = [];
        querySnapshot.forEach((doc) => {
            requests.push({ id: doc.id, ...doc.data() });
        });
        onReceive(requests);
    }, (error) => {
        console.error("Error fetching tatkal requests:", error);
        onReceive([]);
    });

    return unsubscribe;
}

const calculateRewardPoints = (type: string, fare: number) => {
    if (fare < 50) return 0;
    let rate = 0;
    switch(type) {
        case 'Train': rate = 1; break;
        case 'Hotel': rate = 2; break;
        case 'Food': rate = 0.5; break;
    }
    return Math.floor((fare / 100) * rate);
}

export const createBooking = async (uid: string, bookingData: any) => {
    if (!uid) throw new Error("User not authenticated.");

    try {
        await runTransaction(db, async (transaction) => {
            // 1. Create the new booking
            const bookingsCollectionRef = collection(db, 'bookings');
            const newBookingRef = doc(bookingsCollectionRef); // Create a new doc ref with a unique ID
            
            transaction.set(newBookingRef, {
                ...bookingData,
                userId: uid,
                status: bookingData.status || 'Confirmed',
                createdAt: serverTimestamp(),
            });

            // 2. Calculate and award reward points
            const pointsToAward = calculateRewardPoints(bookingData.type, bookingData.fare);
            if (pointsToAward > 0) {
                const userRef = doc(db, `users/${uid}`);
                const userDoc = await transaction.get(userRef);

                if (userDoc.exists()) {
                    const currentPoints = userDoc.data().loyaltyPoints || 0;
                    const newTotalPoints = currentPoints + pointsToAward;
                    
                    const newHistoryEntry = {
                        type: 'earn',
                        source: `${bookingData.type} Booking`,
                        points: pointsToAward,
                        date: new Date().toISOString(),
                        bookingId: newBookingRef.id,
                    };
                    
                    const currentHistory = userDoc.data().rewardsHistory || [];
                    const newHistory = [newHistoryEntry, ...currentHistory];

                    transaction.update(userRef, {
                        loyaltyPoints: newTotalPoints,
                        rewardsHistory: newHistory,
                    });
                }
            }
        });
    } catch (error) {
        console.error("Error creating booking and awarding points:", error);
        throw new Error("Unable to complete booking transaction.");
    }
}

export const getBookings = (uid: string, onReceive: (data: any[]) => void) => {
    if (!uid) {
        onReceive([]);
        return () => {};
    }
    const bookingsQuery = query(
        collection(db, 'bookings'),
        where('userId', '==', uid)
    );

    const unsubscribe = onSnapshot(bookingsQuery, (querySnapshot) => {
        const bookings: any[] = [];
        querySnapshot.forEach((doc) => {
            bookings.push({ id: doc.id, ...doc.data() });
        });
        onReceive(bookings);
    }, (error) => {
        console.error("Error fetching bookings:", error);
        onReceive([]);
    });

    return unsubscribe;
}

export const logChatbotConversation = async (uid: string, messages: any[], language: string) => {
    if (!uid) return;
    const logCollectionRef = collection(db, 'chatbot_logs');
    try {
        await addDoc(logCollectionRef, {
            userId: uid,
            conversation: messages,
            language,
            timestamp: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error logging chatbot conversation:", error);
        // Don't throw error to user, just log it
    }
}

// Admin panel functions
export const getAdminStats = async () => {
    const hotelsCol = collection(db, "hotels");
    const usersCol = collection(db, "users");
    const bookingsCol = collection(db, "bookings");

    const hotelsCount = await getCountFromServer(hotelsCol);
    const usersCount = await getCountFromServer(usersCol);
    const bookingsCount = await getCountFromServer(bookingsCol);

    return {
        hotels: hotelsCount.data().count,
        users: usersCount.data().count,
        bookings: bookingsCount.data().count,
    };
};

export const getRecentBookings = async (days: number) => {
    const bookingsCol = collection(db, "bookings");
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const q = query(bookingsCol, where('createdAt', '>=', Timestamp.fromDate(startDate)));
    const querySnapshot = await getDocs(q);
    const bookingsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return bookingsList;
}

export const getAllHotels = async () => {
    const hotelsCollection = collection(db, 'hotels');
    const hotelsSnapshot = await getDocs(hotelsCollection);
    const hotelsList = hotelsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return hotelsList;
};

export const addHotel = async (hotelData: any) => {
    const hotelsCollection = collection(db, 'hotels');
    await addDoc(hotelsCollection, {
        ...hotelData,
        createdAt: serverTimestamp(),
    });
};

export const updateHotel = async (hotelId: string, hotelData: any) => {
    const hotelRef = doc(db, 'hotels', hotelId);
    await updateDoc(hotelRef, {
        ...hotelData,
        updatedAt: serverTimestamp(),
    });
};

export const deleteHotel = async (hotelId: string) => {
    const hotelRef = doc(db, 'hotels', hotelId);
    await deleteDoc(hotelRef);
};
