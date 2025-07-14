import { openDB, DBSchema } from 'idb';
import type { Log, LogCategory, JournalEntry } from '@/types';

const DB_NAME = 'MindfulTrackDB';
const DB_VERSION = 1;
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
  upgrade(db) {
    if (!db.objectStoreNames.contains(LOGS_STORE)) {
      const store = db.createObjectStore(LOGS_STORE, { keyPath: 'id', autoIncrement: true });
      store.createIndex('timestamp', 'timestamp');
    }
    if (!db.objectStoreNames.contains(JOURNAL_STORE)) {
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
  const id = await db.add(LOGS_STORE, newLog as any); // 'as any' because id is not in the input
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
