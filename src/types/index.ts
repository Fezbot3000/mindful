
export type LogCategory = "Health Fear" | "Intrusive Thought" | "Compulsion" | "Schema Trigger" | "Accomplished" | "Journal Reflection";

export interface Log {
  id: number;
  category: LogCategory;
  intensity: number;
  description?: string;
  emotion?: string;
  emotionPath?: string;
  timestamp: Date;
}

export interface JournalEntry {
  id: number;
  title: string;
  content: string;
  timestamp: Date;
  intensity?: number;
  trigger?: string;
  evidenceFor?: string;
  evidenceAgainst?: string;
  alternativeView?: string;
  schemaLink?: string;
}
