/**
 * Prompts verified against the Pinecone e5 index (retrieval score >= 0.78).
 * Do not add prompts here without running: python backend/scripts/test_prompts.py
 */
export type SuggestedPrompt = {
  label: string;
  prompt: string;
  emoji: string;
};

export const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    emoji: "💚",
    label: "Mental & physical health",
    prompt: "Can mental health problems affect physical health?",
  },
  {
    emoji: "🩺",
    label: "Depression & physical illness",
    prompt: "What is the link between depression and physical illness?",
  },
  {
    emoji: "🏛️",
    label: "Public health policy",
    prompt: "Why is mental health important for public health policy?",
  },
  {
    emoji: "🌍",
    label: "Politiche sanitarie",
    prompt: "Perché la salute mentale è importante per le politiche sanitarie?",
  },
];
