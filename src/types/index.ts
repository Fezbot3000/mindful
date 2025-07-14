
export type LogCategory = "Anxious" | "Avoided" | "Accomplished" | "Ruminating";

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
  prompts?: {
    trigger?: string;
    schemaLink?: string;
    evidence?: string;
  };
  timestamp: Date;
}
