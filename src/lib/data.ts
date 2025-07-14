import { db, auth } from './firebase';
import { collection, addDoc, query, where, getDocs, Timestamp, orderBy, limit } from 'firebase/firestore';
import type { Log, LogCategory, JournalEntry } from '@/types';

// Logs
export const addLog = async (logData: { category: LogCategory; intensity: number; description?: string }) => {
  if (!auth.currentUser) throw new Error("User not authenticated");
  const log = {
    ...logData,
    userId: auth.currentUser.uid,
    timestamp: Timestamp.now(),
  };
  await addDoc(collection(db, 'users', auth.currentUser.uid, 'logs'), log);
};

export const getLogs = async (): Promise<Log[]> => {
    if (!auth.currentUser) return [];
    const q = query(collection(db, 'users', auth.currentUser.uid, 'logs'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Log));
};


export const getRecentLogs = async (logLimit: number = 5): Promise<Log[]> => {
    if (!auth.currentUser) return [];
    const q = query(
        collection(db, 'users', auth.currentUser.uid, 'logs'), 
        orderBy('timestamp', 'desc'),
        limit(logLimit)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Log));
};

export const getLogsForDateRange = async (startDate: Date, endDate: Date): Promise<Log[]> => {
    if (!auth.currentUser) return [];
    const q = query(
        collection(db, 'users', auth.currentUser.uid, 'logs'),
        where('timestamp', '>=', startDate),
        where('timestamp', '<=', endDate),
        orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Log));
};
