
"use client";

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { Log } from '@/types';
import { getLogs as fetchLogs } from '@/lib/data';

interface LogsContextType {
  logs: Log[];
  loading: boolean;
  addLog: (log: Log) => void;
  setLogs: React.Dispatch<React.SetStateAction<Log[]>>;
}

const LogsContext = createContext<LogsContextType | undefined>(undefined);

export const LogsProvider = ({ children }: { children: ReactNode }) => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      const fetchedLogs = await fetchLogs();
      setLogs(fetchedLogs);
      setLoading(false);
    };
    loadLogs();
  }, []);

  const addLog = useCallback((log: Log) => {
    setLogs(prevLogs => [log, ...prevLogs].sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()));
  }, []);

  return (
    <LogsContext.Provider value={{ logs, loading, addLog, setLogs }}>
      {children}
    </LogsContext.Provider>
  );
};

export const useLogs = () => {
  const context = useContext(LogsContext);
  if (context === undefined) {
    throw new Error('useLogs must be used within a LogsProvider');
  }
  return context;
};
