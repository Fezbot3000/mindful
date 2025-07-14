
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache, Firestore } from "firebase/firestore";
import { getFunctions, Functions } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

interface FirebaseServices {
    app: FirebaseApp;
    auth: Auth;
    db: Firestore;
    functions: Functions;
}

let services: FirebaseServices | undefined;

function getFirebaseApp(): FirebaseServices | undefined {
    if (typeof window === "undefined") {
        return undefined;
    }

    if (services) {
        return services;
    }

    if (!firebaseConfig.projectId) {
        // Silently fail if the config is not provided.
        // The UI will handle showing a "not configured" state.
        return undefined;
    }
    
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

    let db: Firestore;
    try {
        db = initializeFirestore(app, {
            localCache: persistentLocalCache({})
        });
    } catch (error) {
        // This can happen with hot-reloading.
        db = getFirestore(app);
    }

    const auth = getAuth(app);
    const functions = getFunctions(app);

    services = { app, auth, db, functions };
    return services;
}

export { getFirebaseApp };
