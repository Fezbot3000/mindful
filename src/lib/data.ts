import { openDB, DBSchema } from 'idb';
import type { Log, LogCategory, JournalEntry } from '@/types';

const DB_NAME = 'MindfulTrackDB';
const DB_VERSION = 2; // Incremented version for schema change
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

const dbPromise = openDB<MindfulTrackDB>(DB_NAME, DB_VERSION, {
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
      // For version 2, we just rebuild the journal store to add new optional fields.
      // In a real-world scenario with existing data, a migration would be needed.
      // For this simple case, deleting and recreating is sufficient.
      if (db.objectStoreNames.contains(JOURNAL_STORE)) {
          db.deleteObjectStore(JOURNAL_STORE);
      }
      const store = db.createObjectStore(JOURNAL_STORE, { keyPath: 'id', autoIncrement: true });
      store.createIndex('timestamp', 'timestamp');
    }
  },
});

export const addLog = async (logData: { category: LogCategory; intensity: number; description?: string }): Promise<Log> => {
  const db = await dbPromise;
  const newLog = {
    ...logData,
    timestamp: new Date(),
  };
  const id = await db.add(LOGS_STORE, newLog as any);
  return { id, ...newLog };
};

export const getLogs = async (): Promise<Log[]> => {
  const db = await dbPromise;
  const logs = await db.getAllFromIndex(LOGS_STORE, 'timestamp');
  return logs.reverse(); // Most recent first
};

export const getRecentLogs = async (logLimit: number = 5): Promise<Log[]> => {
  const allLogs = await getLogs();
  return allLogs.slice(0, logLimit);
};

export const getLogsForDateRange = async (startDate: Date, endDate: Date): Promise<Log[]> => {
    const db = await dbPromise;
    const range = IDBKeyRange.bound(startDate, endDate);
    const logs = await db.getAllFromIndex(LOGS_STORE, 'timestamp', range);
    return logs.reverse();
};

// Journal Entry Functions
export const addJournalEntry = async (entryData: Omit<JournalEntry, 'id' | 'timestamp'>): Promise<JournalEntry> => {
  const db = await dbPromise;
  const newEntry = {
    ...entryData,
    timestamp: new Date(),
  };
  const id = await db.add(JOURNAL_STORE, newEntry as any);
  return { id, ...newEntry };
};

export const getJournalEntries = async (): Promise<JournalEntry[]> => {
  const db = await dbPromise;
  const entries = await db.getAllFromIndex(JOURNAL_STORE, 'timestamp');
  return entries.reverse(); // Most recent first
};

export const deleteJournalEntry = async (id: number): Promise<void> => {
  const db = await dbPromise;
  await db.delete(JOURNAL_STORE, id);
};
