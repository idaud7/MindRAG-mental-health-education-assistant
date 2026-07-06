export type SourceItem = {
  filename: string;
  chunk_index: number;
  score: number;
  excerpt: string;
};

export type ChatResponse = {
  query: string;
  answer: string;
  disclaimer: string;
  sources: SourceItem[];
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceItem[];
};
