"use client";

import { SUGGESTED_PROMPTS } from "@/lib/suggested-prompts";

type Props = {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
};

export default function TopicCards({ onSelect, disabled }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-slate-300">Suggested questions</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {SUGGESTED_PROMPTS.map((topic) => (
          <button
            key={topic.label}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(topic.prompt)}
            className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#0d1424]/80 p-4 text-left transition hover:border-cyan-400/30 hover:bg-[#121c30] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="text-xl">{topic.emoji}</span>
            <span>
              <span className="block text-sm font-medium text-white">{topic.label}</span>
              <span className="mt-1 block text-xs leading-5 text-slate-400 line-clamp-2">
                {topic.prompt}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
