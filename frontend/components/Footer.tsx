import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050810]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <p className="font-semibold text-white">MindRAG</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            A mental health education assistant providing general information from verified
            sources. Not intended for diagnosis, treatment, or emergency care.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-slate-400">
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
          <Link href="/chat" className="transition hover:text-white">
            Assistant
          </Link>
          <Link href="/#safety" className="transition hover:text-white">
            Safety & ethics
          </Link>
          <a
            href="https://findahelpline.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-white"
          >
            Crisis helplines
          </a>
        </div>
      </div>
      <div className="border-t border-white/5 px-6 py-4 text-center text-xs leading-5 text-slate-500">
        © {new Date().getFullYear()} MindRAG. For educational purposes only. Not medical advice.
        If you are in crisis, contact emergency services immediately.
      </div>
    </footer>
  );
}
