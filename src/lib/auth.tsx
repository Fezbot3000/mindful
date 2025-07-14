
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getFirebaseApp } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const firebaseServices = getFirebaseApp();
    if (firebaseServices?.auth) {
        const unsubscribe = onAuthStateChanged(firebaseServices.auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    } else {
        // If firebase is not configured, we are not in a loading state.
        // The user is simply not logged in.
        setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? (
        <div className="flex h-screen w-full items-center justify-center">
          <Loader2 className="component-sm animate-spin" />
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
