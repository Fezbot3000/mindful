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

let app: FirebaseApp | undefined;
let auth: ReturnType<typeof getAuth> | undefined;
let db: Firestore | undefined;
let functions: ReturnType<typeof getFunctions> | undefined;

function getFirebaseApp() {
    if (typeof window === "undefined") {
        return { app: undefined, auth: undefined, db: undefined, functions: undefined };
    }

    if (app) {
        return { app, auth, db, functions };
    }

    if (!firebaseConfig.projectId) {
        console.error("Firebase project ID is missing. Please set NEXT_PUBLIC_FIREBASE_PROJECT_ID in your .env.local file.");
        return { app: undefined, auth: undefined, db: undefined, functions: undefined };
    }
    
    if (getApps().length === 0) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApp();
    }

    try {
        db = initializeFirestore(app, {
            localCache: persistentLocalCache({})
        });
    } catch (error) {
        console.error("Firestore initialization error:", error);
        db = getFirestore(app);
    }

    auth = getAuth(app);
    functions = getFunctions(app);

    return { app, auth, db, functions };
}

export { getFirebaseApp };
