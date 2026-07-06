"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070b14]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-lg shadow-lg shadow-cyan-500/10">
            🧠
          </div>
          <div>
            <p className="text-sm font-bold text-white sm:text-base">MindRAG</p>
            <p className="hidden text-xs text-slate-400 sm:block">Mental health education</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          <NavLink href="/" active={pathname === "/"}>
            Home
          </NavLink>
          <NavLink href="/chat" active={pathname === "/chat"}>
            Assistant
          </NavLink>
          <NavLink href="/#safety" active={false}>
            Safety
          </NavLink>
          <Link
            href="/chat"
            className="ml-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:opacity-90"
          >
            Get started
          </Link>
        </nav>

        <button
          type="button"
          className="rounded-xl border border-white/10 p-2 text-slate-300 sm:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
            {open ? (
              <path strokeLinecap="round" strokeWidth="2" d="M6 6l12 12M18 6 6 18" />
            ) : (
              <path strokeLinecap="round" strokeWidth="2" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 px-4 py-3 sm:hidden">
          <div className="flex flex-col gap-2">
            <MobileLink href="/" onClick={() => setOpen(false)}>
              Home
            </MobileLink>
            <MobileLink href="/chat" onClick={() => setOpen(false)}>
              Assistant
            </MobileLink>
            <MobileLink href="/#safety" onClick={() => setOpen(false)}>
              Safety
            </MobileLink>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-xl px-4 py-2 text-sm transition ${
        active ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="rounded-xl px-3 py-2.5 text-sm text-slate-200 hover:bg-white/5"
    >
      {children}
    </Link>
  );
}
