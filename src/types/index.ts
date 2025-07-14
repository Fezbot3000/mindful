import type { Timestamp } from "firebase/firestore";

export type LogCategory = "Intrusive Thought" | "Fear" | "Compulsion" | "Hyper-Fixation";

export interface Log {
  id: string;
  userId: string;
  category: LogCategory;
  intensity: number;
  description?: string;
  timestamp: Timestamp;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  prompts?: {
    trigger?: string;
    schemaLink?: string;
    evidence?: string;
  };
  timestamp: Timestamp;
}
