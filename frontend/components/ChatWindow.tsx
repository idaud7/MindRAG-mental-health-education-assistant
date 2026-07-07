"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { checkHealth, checkReady, sendChatMessage } from "@/lib/api";
import type { ChatMessage } from "@/lib/types";
import MessageBubble from "./MessageBubble";
import TopicCards from "./TopicCards";
import TypingIndicator from "./TypingIndicator";

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello. I'm MindRAG, your mental health education assistant. I provide general information from verified sources in English or Italian. I'm not able to diagnose conditions or offer emergency support — for that, please contact a qualified professional or local helpline.",
};

const STORAGE_KEY = "mindrag-chat-history";

function loadHistory(): ChatMessage[] {
  if (typeof window === "undefined") return [WELCOME_MESSAGE];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [WELCOME_MESSAGE];
    const parsed = JSON.parse(saved) as ChatMessage[];
    return parsed.length > 0 ? parsed : [WELCOME_MESSAGE];
  } catch {
    return [WELCOME_MESSAGE];
  }
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [online, setOnline] = useState<boolean | null>(null);
  const [modelReady, setModelReady] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const showTopics = messages.length === 1 && messages[0]?.id === "welcome";

  useEffect(() => {
    setMessages(loadHistory());
    setHydrated(true);

    let cancelled = false;

    async function pollStatus() {
      const healthy = await checkHealth();
      if (cancelled) return;
      setOnline(healthy);

      if (healthy) {
        const ready = await checkReady();
        if (!cancelled) setModelReady(ready);
      }
    }

    pollStatus();
    // Poll every 15s — generous for HF Spaces that wake from sleep slowly
    const interval = setInterval(pollStatus, 15000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages, hydrated]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function clearChat() {
    setMessages([WELCOME_MESSAGE]);
    setInput("");
    inputRef.current?.focus();
  }

  function askTopic(prompt: string) {
    if (loading || online === false) return;
    setInput("");
    void submitQuery(prompt);
  }

  async function submitQuery(query: string) {
    if (!query.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: query.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await sendChatMessage(query.trim());
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response.answer,
        },
      ]);
      setModelReady(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, I couldn't respond right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const query = input.trim();
    if (!query || loading) return;
    setInput("");
    await submitQuery(query);
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8.5rem)] max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0a1020]/90 shadow-2xl shadow-black/30 backdrop-blur-xl sm:h-[calc(100vh-10rem)]">
      {/* Chat header */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-xl">
            🧠
          </div>
          <div>
            <p className="font-semibold text-white">MindRAG</p>
            <p className="text-xs text-slate-400">
              {online === false
                ? "Waking up — may take up to 60s..."
                : online && !modelReady
                  ? "Loading AI model..."
                  : online
                    ? "Online · English & Italiano"
                    : "Starting up..."}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={clearChat}
          className="rounded-xl border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-white/20 hover:text-white"
        >
          New chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-5">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            role={message.role}
            content={message.content}
            showActions={message.id !== "welcome"}
          />
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-lg">
              🧠
            </div>
            <div className="rounded-2xl rounded-tl-md border border-white/10 bg-[#101827] px-4 py-2">
              <TypingIndicator />
              {!modelReady && (
                <p className="mt-1 text-xs text-slate-500">First reply may take up to a minute...</p>
              )}
            </div>
          </div>
        )}

        {showTopics && !loading && (
          <div className="pt-2">
            <TopicCards onSelect={askTopic} disabled={loading || online === false} />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="shrink-0 border-t border-white/10 bg-[#070b14]/80 px-4 py-4 sm:px-5">
        <form onSubmit={handleSubmit} className="flex items-end gap-2 sm:gap-3">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type your question..."
              disabled={loading || online === false}
              className="w-full rounded-2xl border border-white/10 bg-[#0d1424] px-4 py-3.5 pr-12 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40 disabled:opacity-60"
            />
          </div>
          <button
            type="submit"
            disabled={loading || online === false || !input.trim()}
            aria-label="Send message"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M3.4 20.6 21 12 3.4 3.4l2.8 7.2L16 12l-9.8 1.4-2.8 7.2z" />
            </svg>
          </button>
        </form>
        <p className="mt-2 text-center text-[11px] leading-4 text-slate-500">
          General information only — not medical advice. Conversations are stored locally in your
          browser.
        </p>
      </div>
    </div>
  );
}
