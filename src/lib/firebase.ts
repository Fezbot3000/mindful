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

// Prevent initialization on the server
if (typeof window !== "undefined" && !firebaseConfig.projectId) {
    throw new Error("Missing Firebase project ID. Please set NEXT_PUBLIC_FIREBASE_PROJECT_ID in your environment variables.");
}


let app: FirebaseApp;
let db: Firestore;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  if (typeof window !== "undefined") {
    try {
      db = initializeFirestore(app, {
        localCache: persistentLocalCache({})
      });
    } catch (e) {
      console.error("Failed to initialize Firestore with persistence", e);
      db = getFirestore(app); // fallback to non-persistent
    }
  } else {
    db = getFirestore(app);
  }
} else {
  app = getApp();
  db = getFirestore(app);
}

const auth = getAuth(app);
const functions = getFunctions(app);

export { app, auth, db, functions };
