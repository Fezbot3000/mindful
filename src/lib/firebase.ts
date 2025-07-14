import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache, Firestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// This check is important. It will throw a build-time error if the environment variables are missing.
if (!firebaseConfig.projectId) {
    throw new Error("Missing Firebase project ID. Please set NEXT_PUBLIC_FIREBASE_PROJECT_ID in your .env.local file.");
}

let app: FirebaseApp;
let db: Firestore;

// Initialize Firebase
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Firestore with persistence
try {
    if (typeof window !== "undefined") {
        db = initializeFirestore(app, {
            localCache: persistentLocalCache({})
        });
    } else {
        db = getFirestore(app);
    }
} catch (error) {
    console.error("Firestore initialization error:", error);
    db = getFirestore(app); // Fallback to default firestore instance
}


const auth = getAuth(app);
const functions = getFunctions(app);

export { app, auth, db, functions };
