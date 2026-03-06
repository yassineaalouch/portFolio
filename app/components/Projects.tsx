"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

type ProjectCategory =
  | "all"
  | "web-apps"
  | "full-stack"
  | "open-source"
  | "experiments";

type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  images: string[];
  defaultImageIndex: number;
  techStack: string[];
  categories: ProjectCategory[];
  liveUrl?: string;
  codeUrl?: string;
};

const FILTERS: { value: ProjectCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "web-apps", label: "Web Apps" },
  { value: "full-stack", label: "Full Stack" },
  { value: "open-source", label: "Open Source" },
  { value: "experiments", label: "Experiments" },
];

const DEFAULT_GRADIENTS = [
  "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
  "linear-gradient(135deg, #0c4a6e 0%, #075985 40%, #0f172a 100%)",
  "linear-gradient(135deg, #134e4a 0%, #0f766e 50%, #0f172a 100%)",
  "linear-gradient(135deg, #4c1d95 0%, #5b21b6 40%, #0f172a 100%)",
  "linear-gradient(135deg, #831843 0%, #9d174d 40%, #0f172a 100%)",
  "linear-gradient(135deg, #1e3a5f 0%, #2563eb 40%, #0f172a 100%)",
];

type ProjectFromApi = {
  _id?: string;
  title: string;
  description: string;
  technologies?: string[];
  Screenshots?: string;
  images?: string[];
  defaultImageIndex?: number;
  link?: string;
  codeUrl?: string;
  categories?: string[];
};

function mapApiProjectToProject(item: ProjectFromApi, index: number): Project {
  const id = item._id?.toString() ?? `project-${index}`;
  const images = Array.isArray(item.images)
    ? item.images.filter((u) => typeof u === "string" && (u.startsWith("http") || u.startsWith("/")))
    : (item.Screenshots ?? "").trim()
      ? [(item.Screenshots ?? "").trim()].filter(Boolean)
      : [];
  const defaultIdx = Math.min(
    item.defaultImageIndex ?? 0,
    Math.max(0, images.length - 1)
  );
  const defaultUrl = images[defaultIdx];
  const image = defaultUrl
    ? `url(${defaultUrl})`
    : DEFAULT_GRADIENTS[index % DEFAULT_GRADIENTS.length];
  const rawCategories = item.categories ?? [];
  const categories = rawCategories.filter((c): c is ProjectCategory =>
    ["web-apps", "full-stack", "open-source", "experiments"].includes(c)
  ) as ProjectCategory[];
  return {
    id,
    title: item.title ?? "",
    description: item.description ?? "",
    image,
    images,
    defaultImageIndex: defaultIdx,
    techStack: item.technologies ?? [],
    categories: categories.length > 0 ? categories : (["full-stack"] as ProjectCategory[]),
    liveUrl: item.link ?? "#",
    codeUrl: item.codeUrl ?? "#",
  };
}

function filterProjects(
  projects: Project[],
  filter: ProjectCategory
): Project[] {
  if (filter === "all") return projects;
  return projects.filter((p) => p.categories.includes(filter));
}

type LightboxState = {
  project: Project;
  currentIndex: number;
} | null;

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>("all");
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set()
  );
  const [lightbox, setLightbox] = useState<LightboxState>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map());

  const openLightbox = useCallback((project: Project, index = 0) => {
    const imgs = project.images ?? [];
    if (imgs.length === 0) return;
    setLightbox({
      project,
      currentIndex: Math.min(index, Math.max(0, imgs.length - 1)),
    });
  }, []);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const goPrev = useCallback(() => {
    if (!lightbox) return;
    const imgs = lightbox.project.images ?? [];
    setLightbox((l) =>
      l
        ? {
            ...l,
            currentIndex: (l.currentIndex - 1 + imgs.length) % imgs.length,
          }
        : null
    );
  }, [lightbox]);

  const goNext = useCallback(() => {
    if (!lightbox) return;
    const imgs = lightbox.project.images ?? [];
    setLightbox((l) =>
      l
        ? {
            ...l,
            currentIndex: (l.currentIndex + 1) % imgs.length,
          }
        : null
    );
  }, [lightbox]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!lightbox) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, closeLightbox, goPrev, goNext]);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data: ProjectFromApi[]) => {
        const list = Array.isArray(data) ? data : [];
        setProjects(list.map(mapApiProjectToProject));
      })
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filterProjects(projects, activeFilter);

  useEffect(() => {
    const filteredIds = new Set(
      filterProjects(projects, activeFilter).map((p) => p.id)
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = (entry.target as HTMLElement).dataset.projectId;
          if (id) setVisibleSections((prev) => new Set(prev).add(id));
        });
      },
      { rootMargin: "-60px 0px -80px", threshold: 0.1 }
    );

    cardRefs.current.forEach((el, id) => {
      if (filteredIds.has(id) && el?.isConnected) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [activeFilter, projects]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-black via-slate-950 to-slate-900 px-6 py-20 text-slate-100 sm:py-24 md:py-28"
    >
      {/* Background effects */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -top-20 left-1/4 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-purple-600/15 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Featured Projects
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400 sm:text-lg">
            A selection of projects where I built scalable systems, modern web
            applications, and innovative solutions.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="mb-10 flex flex-wrap justify-center gap-2 sm:mb-12">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setActiveFilter(value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                activeFilter === value
                  ? "bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/50"
                  : "bg-white/5 text-slate-400 ring-1 ring-white/10 hover:bg-white/10 hover:text-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Project grid */}
        {loading ? (
          <p className="py-12 text-center text-slate-400">Chargement des projets…</p>
        ) : (
        <ul className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, index) => (
            <li
              key={project.id}
              ref={(el) => {
                if (el) cardRefs.current.set(project.id, el);
                else cardRefs.current.delete(project.id);
              }}
              data-project-id={project.id}
              className={`project-card flex flex-col rounded-2xl border border-white/10 bg-slate-900/40 shadow-xl backdrop-blur-sm transition-all duration-300 ${
                visibleSections.has(project.id)
                  ? "project-card-visible opacity-100"
                  : "project-card-hidden opacity-0"
              }`}
              style={{
                transitionDelay: visibleSections.has(project.id)
                  ? `${Math.min(index * 80, 400)}ms`
                  : "0ms",
              }}
            >
              <Link
                href={`/projects/${project.id}`}
                className="group relative block overflow-hidden rounded-t-2xl"
              >
                <div
                  className={`project-card-image aspect-video w-full bg-slate-900/80 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 cursor-pointer`}
                  style={
                    project.image.startsWith("url(")
                      ? { backgroundImage: project.image }
                      : { background: project.image }
                  }
                >
                  {project.image.startsWith("url(") ? (
                    project.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-white/90 backdrop-blur">
                        {project.images.length} images
                      </div>
                    )
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-lg border border-white/10 bg-black/30 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white/70 backdrop-blur">
                        Preview
                      </div>
                    </div>
                  )}
                </div>
                <div className="pointer-events-none absolute inset-0 rounded-t-2xl ring-1 ring-inset ring-white/0 transition-all duration-300 group-hover:ring-cyan-400/40 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]" />
              </Link>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <Link href={`/projects/${project.id}`} className="block">
                  <h3 className="text-lg font-semibold text-slate-100 sm:text-xl hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-400 hover:text-slate-300 transition-colors">
                    {project.description}
                  </p>
                </Link>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-white/10 bg-slate-800/60 px-2 py-0.5 text-xs font-medium text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/projects/${project.id}`}
                    className="inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                  >
                    Voir détails
                  </Link>
                  {project.liveUrl && project.liveUrl !== "#" && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-medium text-slate-50 shadow-[0_0_20px_rgba(56,189,248,0.3)] transition hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                    >
                      Live Demo
                    </a>
                  )}
                  {project.codeUrl && project.codeUrl !== "#" && (
                    <a
                      href={project.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-slate-600 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                    >
                      View Code
                    </a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
        )}

        {!loading && filtered.length === 0 && (
          <p className="py-12 text-center text-slate-500">
            Aucun projet dans cette catégorie.
          </p>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Galerie d'images du projet"
        >
          {/* Backdrop - clic ferme */}
          <div
            className="absolute inset-0"
            onClick={closeLightbox}
            aria-hidden="true"
          />

          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-[60] flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-slate-100 transition hover:bg-white/20"
            aria-label="Fermer"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {lightbox.project.images.length > 1 && (
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

          {/* Zone centrale - image principale */}
          <div className="relative z-10 flex flex-1 items-center justify-center p-4 pt-16">
            <div
              className="max-h-[70vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightbox.project.images[lightbox.currentIndex]}
                alt={`${lightbox.project.title} - Image ${lightbox.currentIndex + 1}`}
                className="max-h-[70vh] max-w-full rounded-lg object-contain shadow-2xl"
              />
              <p className="mt-2 text-center text-sm text-slate-400">
                {lightbox.project.images.length > 1
                  ? `${lightbox.currentIndex + 1} / ${lightbox.project.images.length}`
                  : lightbox.project.title}
              </p>
            </div>
          </div>

          {/* Bande de miniatures - toujours visible et cliquable */}
          <div
            className="relative z-[60] flex shrink-0 justify-center gap-2 overflow-x-auto border-t border-white/10 bg-black/50 px-4 py-3"
            onClick={(e) => e.stopPropagation()}
          >
            {lightbox.project.images.map((url, i) => (
              <button
                key={`${url}-${i}`}
                type="button"
                onClick={() => setLightbox((l) => (l ? { ...l, currentIndex: i } : null))}
                className={`flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition hover:border-cyan-400/70 ${
                  i === lightbox.currentIndex
                    ? "border-cyan-400 ring-2 ring-cyan-400/50"
                    : "border-white/20"
                }`}
                aria-label={`Voir image ${i + 1}`}
              >
                <img
                  src={url}
                  alt=""
                  className="h-14 w-20 object-cover"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
