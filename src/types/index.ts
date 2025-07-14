
export type LogCategory = "Health Fear" | "Intrusive Thought" | "Compulsion" | "Schema Trigger" | "Accomplished";

export interface Log {
  id: number;
  category: LogCategory;
  intensity: number;
  description?: string;
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
