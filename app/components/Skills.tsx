"use client";

import { useEffect, useRef, useState } from "react";

type SkillCategoryId =
  | "frontend"
  | "backend"
  | "database"
  | "cloud-devops";

type SkillCategory = {
  id: SkillCategoryId;
  title: string;
  description: string;
  skills: string[];
};

const CATEGORY_IDS: SkillCategoryId[] = [
  "frontend",
  "backend",
  "database",
  "cloud-devops",
];

function mapApiToCategories(data: {
  categories?: Record<string, { title?: string; description?: string; skills?: string[] }>;
}): SkillCategory[] {
  const cats = data?.categories ?? {};
  return CATEGORY_IDS.map((id) => {
    const key = id === "cloud-devops" ? "cloudDevops" : id;
    const c = cats[key];
    const defaults: Record<SkillCategoryId, SkillCategory> = {
      frontend: {
        id: "frontend",
        title: "Frontend Development",
        description: "Building fast, accessible, and delightful user interfaces.",
        skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML5", "CSS3"],
      },
      backend: {
        id: "backend",
        title: "Backend Development",
        description: "Designing robust APIs and services that scale.",
        skills: ["Node.js", "Express", "Python", "REST APIs", "GraphQL"],
      },
      database: {
        id: "database",
        title: "Database",
        description: "Modeling data for reliability, performance, and simplicity.",
        skills: ["MongoDB", "PostgreSQL", "Redis"],
      },
      "cloud-devops": {
        id: "cloud-devops",
        title: "Cloud & DevOps",
        description: "Automating deployment and infrastructure for modern teams.",
        skills: ["Docker", "AWS", "Cloudflare", "CI/CD", "Linux"],
      },
    };
    const def = defaults[id];
    return {
      id,
      title: c?.title ?? def.title,
      description: c?.description ?? def.description,
      skills: Array.isArray(c?.skills) ? c.skills.filter((s) => typeof s === "string" && s.trim()) : def.skills,
    };
  });
}

export default function Skills() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    fetch("/api/site/skills")
      .then((r) => {
        if (!r.ok) throw new Error("Skills API error");
        return r.json();
      })
      .then((data) => {
        const list = mapApiToCategories(data ?? {});
        setCategories(list);
        setVisible(new Set(list.map((c) => c.id)));
      })
      .catch(() => {
        const list = mapApiToCategories({});
        setCategories(list);
        setVisible(new Set(list.map((c) => c.id)));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (categories.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = (entry.target as HTMLElement).dataset.categoryId;
          if (id) {
            setVisible((prev) => {
              const next = new Set(prev);
              next.add(id);
              return next;
            });
          }
        });
      },
      { rootMargin: "-80px 0px -80px", threshold: 0.15 }
    );

    const timer = setTimeout(() => {
      cardRefs.current.forEach((el) => {
        if (el?.isConnected) observer.observe(el);
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [categories.length]);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-black px-6 py-20 text-slate-100 sm:py-24 md:py-28"
    >
      {/* Background effects */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -top-24 right-1/5 h-64 w-64 rounded-full bg-sky-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/5 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 0 0, rgba(148,163,184,0.45) 0, transparent 55%),
              linear-gradient(rgba(148,163,184,0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(148,163,184,0.2) 1px, transparent 1px)
            `,
            backgroundSize: "auto, 56px 56px, 56px 56px",
          }}
        />
      </div>

      {/* Floating badges */}
      <div className="pointer-events-none absolute inset-0">
        <FloatingSkillBadge label="React" className="left-[6%] top-[16%]" />
        <FloatingSkillBadge
          label="Next.js"
          className="right-[10%] top-[26%]"
          variant="neutral"
        />
        <FloatingSkillBadge
          label="Node.js"
          className="left-[12%] bottom-[18%]"
          variant="green"
        />
        <FloatingSkillBadge
          label="AWS"
          className="right-[14%] bottom-[22%]"
          variant="amber"
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Skills &amp; Tech Stack
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400 sm:text-lg">
            Technologies and tools I use to build modern, scalable, and
            high-performance applications.
          </p>
        </div>

        {/* Categories grid */}
        {loading ? (
          <p className="py-12 text-center text-slate-400">Chargement des compétences…</p>
        ) : (
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
          {categories.map((category, index) => (
            <article
              key={category.id}
              ref={(el) => {
                if (el) cardRefs.current.set(category.id, el);
                else cardRefs.current.delete(category.id);
              }}
              data-category-id={category.id}
              className={`skills-card relative flex flex-col rounded-2xl border border-white/10 bg-slate-900/40 p-5 shadow-xl backdrop-blur-md transition-all duration-300 sm:p-6 ${
                visible.has(category.id)
                  ? "skills-card-visible opacity-100"
                  : "skills-card-hidden opacity-0"
              }`}
              style={{
                transitionDelay: visible.has(category.id)
                  ? `${Math.min(index * 90, 360)}ms`
                  : "0ms",
              }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/4 via-white/0 to-white/5 opacity-80 mix-blend-soft-light" />
              <div className="relative">
                <header className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 sm:text-xl">
                      {category.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {category.description}
                    </p>
                  </div>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/90 text-xs font-medium text-slate-200 ring-1 ring-white/10">
                    {category.title.split(" ")[0]}
                  </span>
                </header>

                <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-4">
                  {category.skills.map((skill) => (
                    <SkillIcon key={skill} name={skill} />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}

import { SKILL_LABEL_TO_SLUG } from "@/lib/skillsData";

function getSkillIconSlug(name: string): string | null {
  const trimmed = name.trim();
  return SKILL_LABEL_TO_SLUG[trimmed] ?? null;
}

type SkillIconProps = {
  name: string;
};

function SkillIcon({ name }: SkillIconProps) {
  const slug = getSkillIconSlug(name);
  const letter = name[0] ?? "?";

  return (
    <div className="group flex flex-col items-center gap-2 text-center">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-sm font-semibold text-slate-100 shadow-[0_0_25px_rgba(15,23,42,0.85)] ring-1 ring-white/10 transition-all duration-200 group-hover:-translate-y-1 group-hover:scale-[1.06] group-hover:bg-gradient-to-br group-hover:from-cyan-500/40 group-hover:via-sky-500/30 group-hover:to-purple-500/40 group-hover:ring-cyan-400/70 overflow-hidden">
        {slug ? (
          <img
            src={`https://cdn.simpleicons.org/${slug}/e2e8f0`}
            alt=""
            className="h-6 w-6 object-contain"
          />
        ) : (
          <span className="text-base font-semibold">{letter}</span>
        )}
      </div>
      <span className="text-xs font-medium text-slate-300 sm:text-sm">
        {name}
      </span>
    </div>
  );
}

type FloatingSkillBadgeProps = {
  label: string;
  className?: string;
  variant?: "cyan" | "neutral" | "green" | "amber";
};

function FloatingSkillBadge({
  label,
  className,
  variant = "cyan",
}: FloatingSkillBadgeProps) {
  const variantClasses: Record<
    NonNullable<FloatingSkillBadgeProps["variant"]>,
    string
  > = {
    cyan: "from-cyan-400/80 to-sky-500/70",
    neutral: "from-slate-100/90 to-slate-300/70 text-slate-900",
    green: "from-emerald-400/80 to-lime-400/70",
    amber: "from-amber-300/90 to-orange-400/80 text-slate-900",
  };

  return (
    <div
      className={`skills-floating-badge pointer-events-none absolute hidden items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1.5 text-[11px] font-medium text-slate-100 shadow-[0_15px_45px_rgba(15,23,42,0.9)] ring-1 ring-white/10 backdrop-blur-md md:inline-flex ${className}`}
    >
      <span
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br text-[10px] shadow-[0_0_18px_rgba(148,163,184,0.75)] ${
          variantClasses[variant]
        }`}
      >
        {label[0]}
      </span>
      <span>{label}</span>
    </div>
  );
}

