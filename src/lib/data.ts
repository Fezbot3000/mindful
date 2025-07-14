import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { Log, LogCategory, JournalEntry } from '@/types';

const DB_NAME = 'MindfulTrackDB';
const DB_VERSION = 2; 
const LOGS_STORE = 'logs';
const JOURNAL_STORE = 'journal';

interface MindfulTrackDB extends DBSchema {
  [LOGS_STORE]: {
    key: number;
    value: Log;
    indexes: { timestamp: Date };
  };
  [JOURNAL_STORE]: {
    key: number;
    value: JournalEntry;
    indexes: { timestamp: Date };
  };
}

let dbPromise: Promise<IDBPDatabase<MindfulTrackDB>> | null = null;

const getDb = () => {
    if (typeof window === 'undefined') {
        // This is a server-side context, so we can't use IndexedDB.
        // Return a dummy object or throw an error, depending on desired behavior.
        // For this app, we'll rely on client-side execution.
        return Promise.reject(new Error("IndexedDB can only be accessed in the browser."));
    }
    if (!dbPromise) {
        dbPromise = openDB<MindfulTrackDB>(DB_NAME, DB_VERSION, {
            upgrade(db, oldVersion) {
                if (oldVersion < 1) {
                    if (!db.objectStoreNames.contains(LOGS_STORE)) {
                        const store = db.createObjectStore(LOGS_STORE, { keyPath: 'id', autoIncrement: true });
                        store.createIndex('timestamp', 'timestamp');
                    }
                    if (!db.objectStoreNames.contains(JOURNAL_STORE)) {
                        const store = db.createObjectStore(JOURNAL_STORE, { keyPath: 'id', autoIncrement: true });
                        store.createIndex('timestamp', 'timestamp');
                    }
                }
                if (oldVersion < 2) {
                    if (db.objectStoreNames.contains(JOURNAL_STORE)) {
                        db.deleteObjectStore(JOURNAL_STORE);
                    }
                    const store = db.createObjectStore(JOURNAL_STORE, { keyPath: 'id', autoIncrement: true });
                    store.createIndex('timestamp', 'timestamp');
                }
            },
        });
    }
    return dbPromise;
};


export const addLog = async (logData: { category: LogCategory; intensity: number; description?: string }): Promise<Log> => {
  const db = await getDb();
  const newLog = {
    ...logData,
    timestamp: new Date(),
  };
  const id = await db.add(LOGS_STORE, newLog as any);
  return { id, ...newLog };
};

export const getLogs = async (): Promise<Log[]> => {
  const db = await getDb();
  const logs = await db.getAllFromIndex(LOGS_STORE, 'timestamp');
  return logs.reverse(); // Most recent first
};

export const getRecentLogs = async (logLimit: number = 5): Promise<Log[]> => {
  const allLogs = await getLogs();
  return allLogs.slice(0, logLimit);
};

export const getLogsForDateRange = async (startDate: Date, endDate: Date): Promise<Log[]> => {
    const db = await getDb();
    const range = IDBKeyRange.bound(startDate, endDate);
    const logs = await db.getAllFromIndex(LOGS_STORE, 'timestamp', range);
    return logs.reverse();
};

// Journal Entry Functions
export const addJournalEntry = async (entryData: Omit<JournalEntry, 'id' | 'timestamp'>): Promise<JournalEntry> => {
  const db = await getDb();
  const newEntry = {
    ...entryData,
    timestamp: new Date(),
  };
  const id = await db.add(JOURNAL_STORE, newEntry as any);
  return { id, ...newEntry };
};

export const getJournalEntries = async (): Promise<JournalEntry[]> => {
  const db = await getDb();
  const entries = await db.getAllFromIndex(JOURNAL_STORE, 'timestamp');
  return entries.reverse(); // Most recent first
};

export const deleteJournalEntry = async (id: number): Promise<void> => {
  const db = await getDb();
  await db.delete(JOURNAL_STORE, id);
};
