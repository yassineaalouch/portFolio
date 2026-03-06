"use client";

import { useEffect, useState } from "react";

const TYPING_PHRASES = [
  "Yassine Aalouch",
  "full stack developer",
  "freelancer",
  "software engineer",
];

const TYPING_MS = 90;
const ERASING_MS = 60;
const PAUSE_AFTER_TYPING_MS = 1800;
const PAUSE_AFTER_ERASING_MS = 400;

function useTypingLoop() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const phrase = TYPING_PHRASES[phraseIndex] ?? "";
    if (!phrase) return;

    if (isTyping) {
      if (displayText.length < phrase.length) {
        const t = setTimeout(() => {
          setDisplayText(phrase.slice(0, displayText.length + 1));
        }, TYPING_MS);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => {
        setIsTyping(false);
      }, PAUSE_AFTER_TYPING_MS);
      return () => clearTimeout(t);
    }
    if (displayText.length > 0) {
      const t = setTimeout(() => {
        setDisplayText(phrase.slice(0, displayText.length - 1));
      }, ERASING_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setPhraseIndex((i) => (i + 1) % TYPING_PHRASES.length);
      setIsTyping(true);
    }, PAUSE_AFTER_ERASING_MS);
    return () => clearTimeout(t);
  }, [phraseIndex, displayText, isTyping]);

  return displayText;
}

export default function Hero() {
  const animatedName = useTypingLoop();

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black text-slate-100"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -top-40 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-40 left-0 h-72 w-72 rounded-full bg-purple-600/30 blur-3xl" />
        <div className="absolute -right-32 top-10 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[100vh] max-w-6xl flex-col items-center gap-6 px-6 pb-16 pt-20 md:flex-row md:items-center md:justify-between md:gap-8 md:pt-24 lg:pt-28">
        <div className="max-w-xl space-y-4 md:space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Freelance Software Engineer • Full Stack Web Developer</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Hi, I&apos;m{" "}
              <span
                className="inline-block min-w-[0.5em] bg-gradient-to-r from-cyan-400 via-sky-500 to-purple-500 bg-clip-text text-transparent"
                aria-label={TYPING_PHRASES.join(", ")}
              >
                {animatedName}
                <span
                  className="ml-0.5 animate-pulse text-cyan-400"
                  aria-hidden="true"
                >
                  |
                </span>
              </span>
            </h1>
            <p className="text-balance text-sm text-slate-300 sm:text-base md:text-lg">
              Freelance Software Engineer &amp; Web Designer building scalable web
              applications and modern digital experiences.
            </p>
          </div>

          <p className="max-w-lg text-sm text-slate-400 sm:text-base">
            I specialize in full-stack development, cloud architecture, and
            building high-performance web platforms. Available for remote
            projects worldwide.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-sm font-medium text-slate-50 shadow-[0_0_30px_rgba(56,189,248,0.5)] transition hover:shadow-[0_0_45px_rgba(56,189,248,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              View My Projects
              <span className="ml-2 inline-block h-4 w-4 translate-x-0 transition-transform group-hover:translate-x-1">
                <svg
                  viewBox="0 0 20 20"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    d="M5 15L15 5M8 5h7v7"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </a>

            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full border border-slate-700/80 bg-slate-900/40 px-6 py-2.5 text-sm font-medium text-slate-100 shadow-[0_0_26px_rgba(15,23,42,0.8)] backdrop-blur-md transition hover:border-slate-500 hover:bg-slate-900/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Contact Me
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 md:text-sm">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 shadow-lg ring-1 ring-white/10">
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
              </span>
              <span>Available for remote roles & collaborations</span>
            </div>

            <div className="hidden h-px flex-1 bg-gradient-to-r from-slate-700/70 via-slate-600/20 to-transparent sm:block" />
          </div>
        </div>

        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute -inset-10 -z-10 bg-[radial-gradient(circle_at_top,_#22d3ee33,_transparent_60%),radial-gradient(circle_at_bottom,_#a855f733,_transparent_55%)]" />

          <div className="relative aspect-[4/5] w-full rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_25px_80px_rgba(15,23,42,0.9)] backdrop-blur-3xl">
            <div className="absolute -left-6 top-8 h-24 w-24 rounded-3xl border border-cyan-400/40 bg-gradient-to-br from-cyan-500/40 to-slate-900/90 shadow-[0_0_40px_rgba(34,211,238,0.8)] blur-sm" />
            <div className="absolute -right-8 bottom-10 h-28 w-28 rounded-full bg-purple-500/40 shadow-[0_0_50px_rgba(168,85,247,0.9)] blur" />

            <div className="relative flex h-full flex-col justify-between rounded-2xl bg-gradient-to-br from-slate-950/90 via-slate-900/95 to-slate-950/80 p-5 ring-1 ring-white/10">
              <header className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-800 text-xs font-semibold text-slate-100 shadow-inner shadow-slate-950">
                    &lt;/&gt;
                  </span>
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-slate-100">
                      Live coding session
                    </p>
                    <p className="text-[10px] text-slate-500">
                      full-stack • performance • cloud
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-300/90" />
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400/90" />
                </div>
              </header>

              <div className="relative flex-1 overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-950/90 p-4 text-[11px] leading-relaxed text-slate-300 shadow-inner shadow-slate-950">
                <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-b from-slate-950/80 via-slate-900/50 to-slate-950/90 px-2 text-[10px] text-slate-500">
                  <div className="space-y-1 pt-1">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="tabular-nums">
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="ml-10 space-y-1.5">
                  <p className="code-line">
                    <span className="token-keyword">const</span>{" "}
                    <span className="token-variable">stack</span>{" "}
                    <span className="token-operator">=</span>{" "}
                    <span className="token-bracket">[</span>
                    <span className="token-string">&quot;Next.js&quot;</span>
                    <span className="token-comma">,</span>{" "}
                    <span className="token-string">&quot;React&quot;</span>
                    <span className="token-comma">,</span>{" "}
                    <span className="token-string">&quot;Node.js&quot;</span>
                    <span className="token-bracket">]</span>
                    <span className="token-operator">;</span>
                  </p>
                  <p className="code-line">
                    <span className="token-keyword">const</span>{" "}
                    <span className="token-variable">focus</span>{" "}
                    <span className="token-operator">=</span>{" "}
                    <span className="token-string">
                      &quot;scalable, cloud-native applications&quot;
                    </span>
                    <span className="token-operator">;</span>
                  </p>
                  <p className="code-line">
                    <span className="token-keyword">function</span>{" "}
                    <span className="token-function">buildExperience</span>
                    <span className="token-bracket">(</span>
                    <span className="token-parameter">idea</span>
                    <span className="token-bracket">)</span>{" "}
                    <span className="token-bracket">{`{`}</span>
                  </p>
                  <p className="code-line pl-4">
                    <span className="token-keyword">return</span>{" "}
                    <span className="token-function">ship</span>
                    <span className="token-bracket">(</span>
                    <span className="token-parameter">idea</span>
                    <span className="token-comma">,</span>{" "}
                    <span className="token-variable">stack</span>
                    <span className="token-comma">,</span>{" "}
                    <span className="token-variable">focus</span>
                    <span className="token-bracket">)</span>
                    <span className="token-operator">;</span>
                  </p>
                  <p className="code-line">
                    <span className="token-bracket">{`}`}</span>
                  </p>
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
              </div>

              <footer className="mt-4 flex items-center justify-between gap-3 text-[10px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/90 text-[9px] font-medium text-slate-100 ring-1 ring-white/10">
                    ⚡
                  </span>
                  <span>Deploying to cloud in seconds</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/90" />
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400/80" />
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500/80" />
                </div>
              </footer>
            </div>
          </div>

          <div className="pointer-events-none absolute -right-3 top-10 flex flex-col gap-3">
            <TechBadge label="React" color="from-cyan-400 to-sky-400" />
            <TechBadge label="Next.js" color="from-slate-100 to-slate-400" />
            <TechBadge label="Node.js" color="from-emerald-400 to-lime-400" />
          </div>

          <div className="pointer-events-none absolute -left-4 bottom-4 flex flex-col gap-3">
            <TechBadge label="Docker" color="from-sky-400 to-blue-500" />
            <TechBadge label="Cloud" color="from-violet-400 to-fuchsia-500" />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] text-slate-400 sm:text-xs">
        <span className="tracking-[0.2em] uppercase">Scroll</span>
        <div className="flex h-9 w-[1px] items-start overflow-hidden rounded-full bg-slate-600/60">
          <span className="scroll-indicator h-9 w-[1px] bg-slate-50" />
        </div>
      </div>
    </section>
  );
}

type TechBadgeProps = {
  label: string;
  color: string;
};

const TECH_BADGE_ICON_SLUGS: Record<string, string> = {
  React: "react",
  "Next.js": "nextdotjs",
  "Node.js": "nodedotjs",
  Docker: "docker",
  Cloud: "cloudflare",
};

function TechBadge({ label, color }: TechBadgeProps) {
  const slug = TECH_BADGE_ICON_SLUGS[label] ?? null;

  return (
    <div
      className={`tech-badge relative inline-flex items-center gap-2 rounded-full bg-slate-900/70 px-3 py-1.5 text-[11px] font-medium text-slate-100 shadow-[0_18px_45px_rgba(15,23,42,0.9)] ring-1 ring-white/10`}
    >
      <span
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br ${color} text-[10px] shadow-[0_0_20px_rgba(148,163,184,0.8)] overflow-hidden`}
      >
        {slug ? (
          <img
            src={`https://cdn.simpleicons.org/${slug}/e2e8f0`}
            alt=""
            className="h-3.5 w-3.5 object-contain"
          />
        ) : (
          <span>{label[0]}</span>
        )}
      </span>
      <span>{label}</span>
    </div>
  );
}

