"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

const STORAGE_KEY_ID = "portfolio_visitor_id";

type Project = {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  categories: string[];
  link: string;
  codeUrl: string;
  images: string[];
  defaultImageIndex: number;
};

type ProjectDetailClientProps = { project: Project };

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Track visit on mount (general + project-specific)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedId = localStorage.getItem(STORAGE_KEY_ID);
    const body: { visitorId?: string; section?: string } = { section: "projects" };
    if (storedId) body.visitorId = storedId;
    fetch("/api/visitors/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((r) => r.json())
      .then((data) => {
        const vid = data.visitorId ?? storedId;
        if (data.visitorId) localStorage.setItem(STORAGE_KEY_ID, data.visitorId);
        // Track project-specific visit with visitorId for unique count
        return fetch(`/api/projects/${project.id}/visit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId: vid ?? undefined }),
        });
      })
      .catch(() => {});
  }, [project.id]);

  const goPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    const imgs = project.images;
    setLightboxIndex((lightboxIndex - 1 + imgs.length) % imgs.length);
  }, [lightboxIndex, project.images]);

  const goNext = useCallback(() => {
    if (lightboxIndex === null) return;
    const imgs = project.images;
    setLightboxIndex((lightboxIndex + 1) % imgs.length);
  }, [lightboxIndex, project.images]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, goPrev, goNext]);

  const imgs = project.images ?? [];
  const defaultIdx = Math.min(project.defaultImageIndex, Math.max(0, imgs.length - 1));

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400/50 hover:bg-slate-800/80 hover:text-cyan-200"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour aux projets
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-medium text-slate-50 shadow-[0_0_20px_rgba(56,189,248,0.3)] transition hover:shadow-[0_0_30px_rgba(56,189,248,0.5)]"
          >
            Accueil
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Title */}
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl md:text-5xl">
          {project.title}
        </h1>

        {/* Categories */}
        {project.categories?.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {project.categories.map((cat) => (
              <span
                key={cat}
                className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-0.5 text-xs font-medium text-cyan-300"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Image gallery */}
        <div className="mb-10">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60">
            {imgs.length > 0 ? (
              <div
                role="button"
                tabIndex={0}
                onClick={() => setLightboxIndex(defaultIdx)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setLightboxIndex(defaultIdx)}
                className="aspect-video w-full cursor-zoom-in bg-slate-900 bg-cover bg-center transition-transform hover:scale-[1.01]"
                style={{ backgroundImage: `url(${imgs[defaultIdx]})` }}
              >
                {imgs.length > 1 && (
                  <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white/90 backdrop-blur">
                    {imgs.length} images — cliquer pour agrandir
                  </div>
                )}
              </div>
            ) : (
              <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                <span className="rounded-lg border border-white/10 bg-black/30 px-4 py-2 font-mono text-sm uppercase tracking-wider text-white/50">
                  Aucune image
                </span>
              </div>
            )}
            {imgs.length > 1 && (
              <div className="flex gap-2 overflow-x-auto border-t border-white/10 bg-slate-950/80 p-3">
                {imgs.map((url, i) => (
                  <button
                    key={`${url}-${i}`}
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    className={`flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${
                      i === defaultIdx ? "border-cyan-400 ring-2 ring-cyan-400/50" : "border-white/20 hover:border-white/40"
                    }`}
                  >
                    <img src={url} alt="" className="h-16 w-24 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mb-10">
          <h2 className="mb-3 text-lg font-semibold text-slate-200">Description</h2>
          <p className="whitespace-pre-wrap text-slate-400 leading-relaxed">{project.description}</p>
        </div>

        {/* Technologies */}
        {project.technologies?.length > 0 && (
          <div className="mb-10">
            <h2 className="mb-3 text-lg font-semibold text-slate-200">Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-white/10 bg-slate-800/60 px-3 py-1.5 text-sm font-medium text-slate-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        <div className="flex flex-wrap gap-4">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                const vid = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY_ID) : null;
                fetch(`/api/projects/${project.id}/track-link`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ type: "demo", visitorId: vid ?? undefined }),
                }).catch(() => {});
                window.open(project.link, "_blank", "noopener,noreferrer");
              }}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-medium text-slate-50 shadow-[0_0_20px_rgba(56,189,248,0.3)] transition hover:shadow-[0_0_30px_rgba(56,189,248,0.5)]"
            >
              Live Demo
            </a>
          )}
          {project.codeUrl && (
            <a
              href={project.codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                const vid = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY_ID) : null;
                fetch(`/api/projects/${project.id}/track-link`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ type: "code", visitorId: vid ?? undefined }),
                }).catch(() => {});
                window.open(project.codeUrl, "_blank", "noopener,noreferrer");
              }}
              className="inline-flex items-center justify-center rounded-full border border-slate-600 bg-slate-800/50 px-6 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
            >
              Voir le code
            </a>
          )}
        </div>
      </main>

      {/* Lightbox */}
      {lightboxIndex !== null && imgs.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Galerie d'images"
        >
          <div className="absolute inset-0" onClick={() => setLightboxIndex(null)} aria-hidden />
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute right-4 top-4 z-[60] flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-slate-100 transition hover:bg-white/20"
            aria-label="Fermer"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {imgs.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-4 top-1/2 z-[60] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-slate-100 transition hover:bg-white/20"
                aria-label="Image précédente"
              >
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-4 top-1/2 z-[60] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-slate-100 transition hover:bg-white/20"
                aria-label="Image suivante"
              >
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          <div className="relative z-10 flex flex-1 items-center justify-center p-4 pt-16" onClick={(e) => e.stopPropagation()}>
            <img
              src={imgs[lightboxIndex]}
              alt={`${project.title} - Image ${lightboxIndex + 1}`}
              className="max-h-[70vh] max-w-full rounded-lg object-contain shadow-2xl"
            />
          </div>
          {imgs.length > 1 && (
            <div className="relative z-[60] flex shrink-0 justify-center gap-2 overflow-x-auto border-t border-white/10 bg-black/50 px-4 py-3">
              {imgs.map((url, i) => (
                <button
                  key={`${url}-${i}`}
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  className={`flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    i === lightboxIndex ? "border-cyan-400 ring-2 ring-cyan-400/50" : "border-white/20"
                  }`}
                >
                  <img src={url} alt="" className="h-14 w-20 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
