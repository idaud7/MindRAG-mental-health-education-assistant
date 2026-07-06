export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1 py-2">
      <span className="typing-dot h-2 w-2 rounded-full bg-slate-400" />
      <span className="typing-dot h-2 w-2 rounded-full bg-slate-400 [animation-delay:0.15s]" />
      <span className="typing-dot h-2 w-2 rounded-full bg-slate-400 [animation-delay:0.3s]" />
    </div>
  );
}
