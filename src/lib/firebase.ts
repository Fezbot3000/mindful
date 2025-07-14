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

// This check is important for client-side rendering where process.env is available.
if (typeof window !== "undefined" && !firebaseConfig.projectId) {
    throw new Error("Missing Firebase project ID. Please set NEXT_PUBLIC_FIREBASE_PROJECT_ID in your environment variables.");
}

let app: FirebaseApp;
let db: Firestore;

try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }

    if (typeof window !== "undefined") {
        try {
            db = initializeFirestore(app, {
                localCache: persistentLocalCache({})
            });
        } catch (e) {
            console.error("Failed to initialize Firestore with persistence, falling back.", e);
            db = getFirestore(app);
        }
    } else {
        db = getFirestore(app);
    }
} catch (error) {
    console.error("Firebase initialization error:", error);
    // Provide dummy objects to prevent the app from crashing entirely
    // if Firebase fails to initialize. This is safer for SSR/build time.
    app = {} as FirebaseApp;
    db = {} as Firestore;
}


const auth = getAuth(app);
const functions = getFunctions(app);

export { app, auth, db, functions };
