import type { ChatResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

export async function sendChatMessage(query: string): Promise<ChatResponse> {
  const response = await fetchWithTimeout(
    `${API_URL}/chat`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    },
    120000
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || "Failed to get a response from the RAG API");
  }

  return response.json();
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetchWithTimeout(`${API_URL}/health`, { cache: "no-store" }, 3000);
    return response.ok;
  } catch {
    return false;
  }
}

export async function checkReady(): Promise<boolean> {
  try {
    const response = await fetchWithTimeout(`${API_URL}/ready`, { cache: "no-store" }, 3000);
    if (!response.ok) return false;
    const data = await response.json();
    return Boolean(data.ready);
  } catch {
    return false;
  }
}
