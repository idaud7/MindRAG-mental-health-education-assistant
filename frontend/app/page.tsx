import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";

const principles = [
  {
    title: "Evidence-informed answers",
    detail:
      "Responses are grounded in curated mental health publications, not open-ended speculation.",
  },
  {
    title: "Multilingual access",
    detail: "Support for English and Italian so more people can access clear information.",
  },
  {
    title: "Privacy by design",
    detail:
      "Conversations stay in your browser session. No account is required to use the assistant.",
  },
];

const steps = [
  {
    step: "01",
    title: "Ask your question",
    detail: "Type a mental health question in everyday language.",
  },
  {
    step: "02",
    title: "Relevant information is found",
    detail: "The system searches trusted material related to your question.",
  },
  {
    step: "03",
    title: "Clear guidance is provided",
    detail: "You receive a concise, supportive answer written in plain language.",
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(34,211,238,0.12),transparent_40%),radial-gradient(circle_at_85%_10%,rgba(139,92,246,0.12),transparent_35%)]" />
      <Header />

      <section className="mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:pt-20">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-xs font-medium text-emerald-200">
            Confidential · Educational · Multilingual
          </p>
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Trusted mental health information, when you need it
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            MindRAG is a secure education assistant that helps individuals and organisations
            access reliable mental health information — clearly, compassionately, and in your
            language.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/chat"
              className="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-7 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:opacity-90"
            >
              Start a conversation
            </Link>
            <Link
              href="/#safety"
              className="rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
            >
              Safety & ethics
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-cyan-400/15 to-violet-500/15 blur-2xl" />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0a1020] shadow-2xl">
            <div className="border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-lg">
                  🧠
                </div>
                <div>
                  <p className="font-semibold text-white">MindRAG Assistant</p>
                  <p className="text-xs text-emerald-400">Available now</p>
                </div>
              </div>
            </div>
            <div className="space-y-4 p-5">
              <PreviewBubble role="assistant">
                Hello. I can help with general mental health education in English or Italian.
              </PreviewBubble>
              <PreviewBubble role="user">
                Can mental health problems affect physical health?
              </PreviewBubble>
              <PreviewBubble role="assistant">
                Yes. Mental, physical, and social health are closely connected. Supporting mental
                wellbeing can improve overall health outcomes...
              </PreviewBubble>
            </div>
            <div className="border-t border-white/10 p-4">
              <div className="rounded-2xl border border-white/10 bg-[#0d1424] px-4 py-3 text-sm text-slate-500">
                Type your question...
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {principles.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
            >
              <h2 className="text-lg font-semibold text-white">{item.title}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-400">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-300">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Simple, thoughtful, and transparent
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {steps.map((item) => (
            <article
              key={item.step}
              className="rounded-3xl border border-white/10 bg-[#0d1424] p-6"
            >
              <span className="text-xs font-bold tracking-widest text-cyan-400">{item.step}</span>
              <h3 className="mt-2 text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-400">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="safety" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-[2rem] border border-amber-400/20 bg-amber-400/5 p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-200">
            Safety & ethics
          </p>
          <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
            Responsible by design
          </h2>
          <ul className="mt-6 space-y-4 text-sm leading-7 text-slate-300">
            <li>
              <strong className="text-white">Not a substitute for care.</strong> MindRAG provides
              general education only. It does not diagnose, treat, or provide emergency support.
            </li>
            <li>
              <strong className="text-white">Crisis support.</strong> If you or someone else is in
              immediate danger, contact local emergency services or visit{" "}
              <a
                href="https://findahelpline.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 underline underline-offset-2"
              >
                findahelpline.com
              </a>
              .
            </li>
            <li>
              <strong className="text-white">Scope of answers.</strong> Suggested questions cover
              topics available in our verified knowledge base. Open-ended questions outside this
              scope may receive limited responses.
            </li>
            <li>
              <strong className="text-white">Your privacy.</strong> Chat history is stored locally
              in your browser and is not shared with third parties.
            </li>
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 pt-4 sm:px-6">
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-400/10 to-violet-500/10 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Have a question about mental wellbeing?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-slate-300">
            Start a private conversation — no registration required.
          </p>
          <Link
            href="/chat"
            className="mt-6 inline-flex rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-8 py-3.5 text-sm font-semibold text-slate-950 transition hover:opacity-90"
          >
            Open assistant
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function PreviewBubble({
  role,
  children,
}: {
  role: "user" | "assistant";
  children: React.ReactNode;
}) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-6 ${
          isUser
            ? "rounded-tr-md bg-gradient-to-br from-cyan-400 to-violet-500 text-slate-950"
            : "rounded-tl-md border border-white/10 bg-[#101827] text-slate-200"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
