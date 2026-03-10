import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-black via-slate-950 to-slate-900 px-6 text-slate-100">
      {/* Background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-0 h-72 w-72 rounded-full bg-purple-600/25 blur-3xl" />
        <div className="absolute left-0 top-1/2 h-64 w-64 rounded-full bg-sky-500/15 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 0 0, rgba(148,163,184,0.6) 0, transparent 55%),
              linear-gradient(rgba(148,163,184,0.25) 1px, transparent 1px),
              linear-gradient(90deg, rgba(148,163,184,0.25) 1px, transparent 1px)
            `,
            backgroundSize: "auto, 60px 60px, 60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        <div className="inline-flex items-center gap-3 rounded-full border border-cyan-500/30 bg-slate-900/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-cyan-300/90">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.9)]" />
          <span>Route not found</span>
        </div>

        <p className="text-7xl font-bold tracking-tighter text-slate-800/80 sm:text-8xl lg:text-9xl">
          404
        </p>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
            You&apos;ve wandered off in my portfolio.
          </h1>
          <p className="max-w-xl text-sm text-slate-400 sm:text-base">
            The link you followed doesn&apos;t point to any project, article or
            existing page. Head back to the main hub or explore my projects.
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-sm font-medium text-slate-50 shadow-[0_0_30px_rgba(56,189,248,0.5)] transition hover:shadow-[0_0_40px_rgba(56,189,248,0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Back to home
          </Link>
          <Link
            href="/#projects"
            className="inline-flex items-center justify-center rounded-full border border-slate-600 bg-slate-900/60 px-5 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400/70 hover:text-cyan-200"
          >
            View my projects
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center rounded-full border border-slate-700/80 bg-slate-900/60 px-5 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-400/70 hover:text-emerald-200"
          >
            Contact me
          </Link>
        </div>

        <div className="mt-6 max-w-xl rounded-2xl border border-slate-800/80 bg-slate-950/80 p-4 text-left text-xs text-slate-400 shadow-[0_18px_40px_rgba(15,23,42,0.9)]">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
            Debug info
          </p>
          <div className="font-mono text-[11px] leading-relaxed">
            <p>
              <span className="text-cyan-300">status</span>
              <span className="text-slate-500">: </span>
              <span className="text-slate-200">404 — Not Found</span>
            </p>
            <p>
              <span className="text-cyan-300">tip</span>
              <span className="text-slate-500">: </span>
              <span className="text-slate-300">
                Check the URL or go back to a known page.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
