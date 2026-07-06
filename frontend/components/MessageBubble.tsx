"use client";

import { useState } from "react";

type Props = {
  role: "user" | "assistant";
  content: string;
  showActions?: boolean;
};

function Avatar({ role }: { role: "user" | "assistant" }) {
  if (role === "user") {
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-xs font-bold text-slate-950">
        You
      </div>
    );
  }

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-lg">
      🧠
    </div>
  );
}

export default function MessageBubble({ role, content, showActions = true }: Props) {
  const [copied, setCopied] = useState(false);
  const isUser = role === "user";

  async function copyMessage() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={`message-enter flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <Avatar role={role} />
      <div className={`group max-w-[min(100%,36rem)] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-7 shadow-sm ${
            isUser
              ? "rounded-tr-md bg-gradient-to-br from-cyan-400 to-violet-500 text-slate-950"
              : "rounded-tl-md border border-white/10 bg-[#101827] text-slate-100"
          }`}
        >
          {content}
        </div>
        {!isUser && showActions && (
          <button
            type="button"
            onClick={copyMessage}
            className="mt-1.5 px-1 text-xs text-slate-500 opacity-0 transition group-hover:opacity-100 hover:text-slate-300"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
    </div>
  );
}
