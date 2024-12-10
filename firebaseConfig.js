// Import the necessary functions from Firebase SDK
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';  // Added persistence option


const firebaseConfig = {
  apiKey: "AIzaSyCn7QyxP_k0_mvUFfqBWzRKs0IS_Rmc5CA",
  authDomain: "newapp-2b700.firebaseapp.com",
  projectId: "newapp-2b700",
  storageBucket: "newapp-2b700.firebasestorage.app",
  messagingSenderId: "1030903452899",
  appId: "1:1030903452899:web:d5a04c0bd4a01c783661d6",
  measurementId: "G-REY5PC740C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);



// Enable Firestore offline persistence (optional)
enableIndexedDbPersistence(firestore)
  .catch((err) => {
    if (err.code == 'unimplemented') {
      console.log("Offline persistence is not supported in this environment.");
    } else if (err.code == 'failed-precondition') {
      console.log("Multiple tabs open, persistence may not work.");
    } else {
      console.log("Error enabling persistence: ", err);
    }
  });

