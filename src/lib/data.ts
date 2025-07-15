
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { Log, LogCategory, JournalEntry } from '@/types';
import { sanitizeInput, sanitizeJsonData, secureLog } from './security';

const DB_NAME = 'MindfulTrackDB';
const DB_VERSION = 3; 
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

let dbPromise: IDBPDatabase<MindfulTrackDB> | null = null;

const getDb = async (): Promise<IDBPDatabase<MindfulTrackDB>> => {
    if (typeof window === 'undefined') {
        // Return a promise that never resolves on the server.
        return new Promise(() => {}) as Promise<IDBPDatabase<MindfulTrackDB>>;
    }
    if (!dbPromise) {
        dbPromise = await openDB<MindfulTrackDB>(DB_NAME, DB_VERSION, {
            upgrade(db, oldVersion) {
                if (oldVersion < 1) {
                    if (!db.objectStoreNames.contains(LOGS_STORE)) {
                        const store = db.createObjectStore(LOGS_STORE, { keyPath: 'id', autoIncrement: true });
                        store.createIndex('timestamp', 'timestamp');
                    }
                }
                if (oldVersion < 2) {
                     if (!db.objectStoreNames.contains(JOURNAL_STORE)) {
                        const store = db.createObjectStore(JOURNAL_STORE, { keyPath: 'id', autoIncrement: true });
                        store.createIndex('timestamp', 'timestamp');
                    }
                }
                if (oldVersion < 3) {
                     // This version was for a bug fix, ensure stores exist.
                     if (!db.objectStoreNames.contains(LOGS_STORE)) {
                        const logStore = db.createObjectStore(LOGS_STORE, { keyPath: 'id', autoIncrement: true });
                        logStore.createIndex('timestamp', 'timestamp');
                    }
                     if (!db.objectStoreNames.contains(JOURNAL_STORE)) {
                        const journalStore = db.createObjectStore(JOURNAL_STORE, { keyPath: 'id', autoIncrement: true });
                        journalStore.createIndex('timestamp', 'timestamp');
                    }
                }
            },
        });
    }
    return dbPromise!;
};


export const addLog = async (logData: { category: LogCategory; intensity: number; description?: string }): Promise<Log> => {
  try {
    const db = await getDb();
    
    // Sanitize input data
    const sanitizedData = {
      category: logData.category, // Enum, no sanitization needed
      intensity: Math.max(1, Math.min(10, Math.floor(logData.intensity))), // Ensure valid range
      description: logData.description ? sanitizeInput(logData.description) : undefined,
    };
    
    const newLog = {
      ...sanitizedData,
      timestamp: new Date(),
    };
    
    // The 'as any' is a temporary workaround for a type inference issue with IDB and auto-incrementing keys.
    const id = await db.add(LOGS_STORE, newLog as any); 
    
    secureLog('info', 'Log added successfully', { 
      id, 
      category: sanitizedData.category,
      intensity: sanitizedData.intensity 
    });
    
    return { id, ...newLog };
  } catch (error) {
    secureLog('error', 'Failed to add log', { error });
    throw new Error('Failed to save log entry');
  }
};

export const getLogs = async (): Promise<Log[]> => {
  try {
    const db = await getDb();
    const logs = await db.getAllFromIndex(LOGS_STORE, 'timestamp');
    // Convert plain objects back to logs with Date objects and sanitize
    const logsWithDates = logs.map(l => ({
      ...l, 
      timestamp: new Date(l.timestamp),
      description: l.description ? sanitizeInput(l.description) : undefined
    }));
    return logsWithDates.reverse(); // Most recent first
  } catch (error) {
    secureLog('error', 'Failed to get logs', { error });
    return [];
  }
};

export const updateLog = async (id: number, logData: { category: LogCategory; intensity: number; description?: string }): Promise<Log> => {
  try {
    const db = await getDb();
    
    // Get existing log to preserve timestamp
    const existingLog = await db.get(LOGS_STORE, id);
    if (!existingLog) {
      throw new Error('Log not found');
    }
    
    // Sanitize input data
    const sanitizedData = {
      category: logData.category,
      intensity: Math.max(1, Math.min(10, Math.floor(logData.intensity))),
      description: logData.description ? sanitizeInput(logData.description) : undefined,
    };
    
    const updatedLog = {
      id,
      ...sanitizedData,
      timestamp: existingLog.timestamp, // Preserve original timestamp
    };
    
    await db.put(LOGS_STORE, updatedLog);
    
    secureLog('info', 'Log updated successfully', { 
      id, 
      category: sanitizedData.category,
      intensity: sanitizedData.intensity 
    });
    
    return updatedLog;
  } catch (error) {
    secureLog('error', 'Failed to update log', { error });
    throw new Error('Failed to update log entry');
  }
};

export const deleteLog = async (id: number): Promise<void> => {
  const db = await getDb();
  await db.delete(LOGS_STORE, id);
};


export const getRecentLogs = async (logLimit: number = 5): Promise<Log[]> => {
  const allLogs = await getLogs();
  return allLogs.slice(0, logLimit);
};

export const getLogsForDateRange = async (startDate: Date, endDate: Date): Promise<Log[]> => {
    const db = await getDb();
    const range = IDBKeyRange.bound(startDate, endDate);
    const logs = await db.getAllFromIndex(LOGS_STORE, 'timestamp', range);
    const logsWithDates = logs.map(l => ({...l, timestamp: new Date(l.timestamp)}));
    return logsWithDates.reverse();
};

// Journal Entry Functions
export const addJournalEntry = async (entryData: Omit<JournalEntry, 'id' | 'timestamp'>): Promise<{newEntry: JournalEntry, newLog: Log}> => {
  try {
    const db = await getDb();
    
    // Sanitize all input data
    const sanitizedData = {
      title: sanitizeInput(entryData.title),
      content: sanitizeInput(entryData.content),
      intensity: entryData.intensity ? Math.max(1, Math.min(10, Math.floor(entryData.intensity))) : undefined,
      trigger: entryData.trigger ? sanitizeInput(entryData.trigger) : undefined,
      evidenceFor: entryData.evidenceFor ? sanitizeInput(entryData.evidenceFor) : undefined,
      evidenceAgainst: entryData.evidenceAgainst ? sanitizeInput(entryData.evidenceAgainst) : undefined,
      alternativeView: entryData.alternativeView ? sanitizeInput(entryData.alternativeView) : undefined,
      schemaLink: entryData.schemaLink ? sanitizeInput(entryData.schemaLink) : undefined,
    };
    
    const timestamp = new Date();
    const newEntryData = {
      ...sanitizedData,
      timestamp,
    };
    
    const entryId = await db.add(JOURNAL_STORE, newEntryData as any);
    const newEntry = { id: entryId, ...newEntryData };

    // Also create a corresponding log entry
    const newLogData = {
        category: "Journal Reflection" as LogCategory,
        intensity: sanitizedData.intensity || 5,
        description: sanitizedData.title,
    };
    const newLog = await addLog(newLogData);

    secureLog('info', 'Journal entry added successfully', { 
      id: entryId, 
      title: sanitizedData.title,
      intensity: sanitizedData.intensity 
    });

    return { newEntry, newLog };
  } catch (error) {
    secureLog('error', 'Failed to add journal entry', { error });
    throw new Error('Failed to save journal entry');
  }
};

export const getJournalEntries = async (): Promise<JournalEntry[]> => {
  try {
    const db = await getDb();
    const entries = await db.getAllFromIndex(JOURNAL_STORE, 'timestamp');
    const entriesWithDates = entries.map(e => ({...e, timestamp: new Date(e.timestamp)}));
    return entriesWithDates.reverse(); // Most recent first
  } catch (error) {
     console.error("Failed to get journal entries, returning empty array:", error);
    return [];
  }
};

export const updateJournalEntry = async (id: number, entryData: Omit<JournalEntry, 'id' | 'timestamp'>): Promise<JournalEntry> => {
  try {
    const db = await getDb();
    
    // Get existing entry to preserve timestamp
    const existingEntry = await db.get(JOURNAL_STORE, id);
    if (!existingEntry) {
      throw new Error('Journal entry not found');
    }
    
    // Sanitize all input data
    const sanitizedData = {
      title: sanitizeInput(entryData.title),
      content: sanitizeInput(entryData.content),
      intensity: entryData.intensity ? Math.max(1, Math.min(10, Math.floor(entryData.intensity))) : undefined,
      trigger: entryData.trigger ? sanitizeInput(entryData.trigger) : undefined,
      evidenceFor: entryData.evidenceFor ? sanitizeInput(entryData.evidenceFor) : undefined,
      evidenceAgainst: entryData.evidenceAgainst ? sanitizeInput(entryData.evidenceAgainst) : undefined,
      alternativeView: entryData.alternativeView ? sanitizeInput(entryData.alternativeView) : undefined,
      schemaLink: entryData.schemaLink ? sanitizeInput(entryData.schemaLink) : undefined,
    };
    
    const updatedEntry = {
      id,
      ...sanitizedData,
      timestamp: existingEntry.timestamp, // Preserve original timestamp
    };
    
    await db.put(JOURNAL_STORE, updatedEntry);
    
    secureLog('info', 'Journal entry updated successfully', { 
      id, 
      title: sanitizedData.title,
      intensity: sanitizedData.intensity 
    });
    
    return updatedEntry;
  } catch (error) {
    secureLog('error', 'Failed to update journal entry', { error });
    throw new Error('Failed to update journal entry');
  }
};

export const deleteJournalEntry = async (id: number): Promise<void> => {
  const db = await getDb();
  await db.delete(JOURNAL_STORE, id);
};

// Data Management Functions
export const importData = async (data: { logs: Omit<Log, 'id'>[], journal: Omit<JournalEntry, 'id'>[] }): Promise<void> => {
    const db = await getDb();
    const tx = db.transaction([LOGS_STORE, JOURNAL_STORE], 'readwrite');
    const logStore = tx.objectStore(LOGS_STORE);
    const journalStore = tx.objectStore(JOURNAL_STORE);
  
    // We don't clear existing data, we merge.
    // A more robust solution might check for duplicates based on content and timestamp.
    // For now, we'll just add all imported items.
    
    const logPromises = data.logs.map(log => {
      // Ensure timestamp is a Date object
      const logWithDate = { ...log, timestamp: new Date(log.timestamp) };
      return logStore.add(logWithDate as any);
    });
  
    const journalPromises = data.journal.map(entry => {
       // Ensure timestamp is a Date object
      const entryWithDate = { ...entry, timestamp: new Date(entry.timestamp) };
      return journalStore.add(entryWithDate as any);
    });
  
    await Promise.all([...logPromises, ...journalPromises, tx.done]);
};
