"use client";

import { useEffect, useState, ChangeEvent, useRef } from "react";
import { SKILLS_CATALOG, SKILL_LABEL_TO_SLUG } from "@/lib/skillsData";

type Project = {
  _id?: string;
  title: string;
  description: string;
  technologies: string[];
  Screenshots?: string;
  images?: string[];
  defaultImageIndex?: number;
  link: string;
  codeUrl?: string;
  categories?: string[];
  visits?: number;
  uniqueVisitors?: number;
  demoVisits?: number;
  demoUniqueVisitors?: number;
  codeVisits?: number;
  codeUniqueVisitors?: number;
};

type ContactInfo = {
  email: string;
  phone: string;
  facebook: string;
  linkedin: string;
  github: string;
  twitter: string;
  location: string;
};

type SkillCategory = {
  title: string;
  description: string;
  skills: string[];
};

type SkillsConfig = {
  categories: {
    frontend: SkillCategory;
    backend: SkillCategory;
    database: SkillCategory;
    cloudDevops: SkillCategory;
  };
};

type Visitor = {
  visitorId: string;
  visitorName: string;
  totalVisits: number;
  lastVisit: string;
  sectionVisits: Record<string, number>;
};

const CATEGORY_GROUP_PREFIXES: Record<string, string[]> = {
  frontend: ["Frontend"],
  backend: ["Backend"],
  database: ["Database"],
  cloudDevops: ["Cloud / DevOps", "Productivity", "Desktop / Mobile"],
};

function TechnologiesDropdown({
  selected,
  onToggle,
  isOpen,
  onToggleOpen,
}: {
  selected: string[];
  onToggle: (skill: string) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}) {
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onToggleOpen();
      }
    };
    if (isOpen) document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, [isOpen, onToggleOpen]);

  const filtered = search.trim()
    ? SKILLS_CATALOG.map((g) => ({
        ...g,
        skills: g.skills.filter((s) =>
          s.label.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter((g) => g.skills.length > 0)
    : SKILLS_CATALOG;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleOpen();
        }}
        className="flex min-h-[80px] w-full flex-wrap items-center gap-2 rounded-lg border border-slate-700/70 bg-slate-950/70 px-3 py-2 text-left text-sm outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/70"
      >
        {selected.length === 0 ? (
          <span className="text-slate-500">Sélectionner des technologies…</span>
        ) : (
          selected.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-600/70 bg-slate-800/80 px-2 py-0.5 text-xs"
            >
              <img
                src={`https://cdn.simpleicons.org/${SKILL_LABEL_TO_SLUG[s] ?? "circle"}/e2e8f0`}
                alt=""
                className="h-3.5 w-3.5"
              />
              {s}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(s);
                }}
                className="ml-0.5 rounded-full hover:bg-slate-600/50"
              >
                ×
              </button>
            </span>
          ))
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-y-auto rounded-lg border border-slate-700/70 bg-slate-950/95 shadow-xl">
          <input
            type="text"
            placeholder="Rechercher une technologie…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-b border-slate-700/70 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none"
          />
          <div className="max-h-56 overflow-y-auto p-2">
            {filtered.map((group) => (
              <div key={group.group} className="mb-3">
                <p className="mb-1 px-2 text-[10px] font-medium uppercase tracking-wider text-slate-500">
                  {group.group}
                </p>
                <div className="flex flex-wrap gap-1">
                  {group.skills.map((skill) => {
                    const isSelected = selected.includes(skill.label);
                    return (
                      <button
                        key={skill.label}
                        type="button"
                        onClick={() => onToggle(skill.label)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs transition ${
                          isSelected
                            ? "bg-cyan-500/30 text-cyan-200 ring-1 ring-cyan-400/50"
                            : "bg-slate-800/80 text-slate-300 hover:bg-slate-700/80"
                        }`}
                      >
                        <img
                          src={`https://cdn.simpleicons.org/${skill.slug}/e2e8f0`}
                          alt=""
                          className="h-3.5 w-3.5"
                        />
                        {skill.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SkillsDropdown({
  selected,
  onToggle,
  openKey,
  isOpen,
  onToggleOpen,
  category,
}: {
  selected: string[];
  onToggle: (skill: string) => void;
  openKey: string;
  isOpen: boolean;
  onToggleOpen: () => void;
  category: "frontend" | "backend" | "database" | "cloudDevops";
}) {
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const catalogForCategory = SKILLS_CATALOG.filter((g) =>
    (CATEGORY_GROUP_PREFIXES[category] ?? []).some((p) => g.group.startsWith(p))
  );

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onToggleOpen();
      }
    };
    if (isOpen) document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, [isOpen, onToggleOpen]);

  const filtered = search.trim()
    ? catalogForCategory.map((g) => ({
        ...g,
        skills: g.skills.filter((s) =>
          s.label.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter((g) => g.skills.length > 0)
    : catalogForCategory;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleOpen();
        }}
        className="flex min-h-[80px] w-full flex-wrap items-center gap-2 rounded-lg border border-slate-700/70 bg-slate-950/70 px-3 py-2 text-left text-sm outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/70"
      >
        {selected.length === 0 ? (
          <span className="text-slate-500">Sélectionner des skills…</span>
        ) : (
          selected.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-600/70 bg-slate-800/80 px-2 py-0.5 text-xs"
            >
              <img
                src={`https://cdn.simpleicons.org/${SKILL_LABEL_TO_SLUG[s] ?? "circle"}/e2e8f0`}
                alt=""
                className="h-3.5 w-3.5"
              />
              {s}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(s);
                }}
                className="ml-0.5 rounded-full hover:bg-slate-600/50"
              >
                ×
              </button>
            </span>
          ))
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-y-auto rounded-lg border border-slate-700/70 bg-slate-950/95 shadow-xl">
          <input
            type="text"
            placeholder="Rechercher…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-b border-slate-700/70 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none"
          />
          <div className="max-h-56 overflow-y-auto p-2">
            {filtered.map((group) => (
              <div key={group.group} className="mb-3">
                <p className="mb-1 px-2 text-[10px] font-medium uppercase tracking-wider text-slate-500">
                  {group.group}
                </p>
                <div className="flex flex-wrap gap-1">
                  {group.skills.map((skill) => {
                    const isSelected = selected.includes(skill.label);
                    return (
                      <button
                        key={skill.label}
                        type="button"
                        onClick={() => onToggle(skill.label)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs transition ${
                          isSelected
                            ? "bg-cyan-500/30 text-cyan-200 ring-1 ring-cyan-400/50"
                            : "bg-slate-800/80 text-slate-300 hover:bg-slate-700/80"
                        }`}
                      >
                        <img
                          src={`https://cdn.simpleicons.org/${skill.slug}/e2e8f0`}
                          alt=""
                          className="h-3.5 w-3.5"
                        />
                        {skill.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "overview" | "content" | "visitors" | "settings"
  >("overview");

  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<Project>({
    title: "",
    description: "",
    technologies: [],
    images: [],
    defaultImageIndex: 0,
    link: "",
    codeUrl: "",
    categories: [],
  });
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [contact, setContact] = useState<ContactInfo>({
    email: "",
    phone: "",
    facebook: "",
    linkedin: "",
    github: "",
    twitter: "",
    location: "",
  });

  const [skills, setSkills] = useState<SkillsConfig>({
    categories: {
      frontend: { title: "Frontend Development", description: "Building fast, accessible, and delightful user interfaces.", skills: [] },
      backend: { title: "Backend Development", description: "Designing robust APIs and services that scale.", skills: [] },
      database: { title: "Database", description: "Modeling data for reliability, performance, and simplicity.", skills: [] },
      cloudDevops: { title: "Cloud & DevOps", description: "Automating deployment and infrastructure for modern teams.", skills: [] },
    },
  });

  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [sectionTotals, setSectionTotals] = useState<Record<string, number>>({
    hero: 0,
    projects: 0,
    skills: 0,
    contact: 0,
    footer: 0,
  });
  const [dailyTrend, setDailyTrend] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [visitRange, setVisitRange] = useState<"7" | "30" | "90">("7");
  const [dailyChartData, setDailyChartData] = useState<{
    labels: string[];
    values: number[];
  }>({ labels: [], values: [] });
  const [dailyChartLoading, setDailyChartLoading] = useState(true);

  const [uploadingImage, setUploadingImage] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [enabledSections, setEnabledSections] = useState<string[]>([
    "hero",
    "projects",
    "skills",
    "contact",
    "footer",
  ]);

  useEffect(() => {
    const load = async () => {
      try {
        const [
          projRes,
          contactRes,
          skillsRes,
          sectionsRes,
          visitorsRes,
        ] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/site/contact"),
          fetch("/api/site/skills"),
          fetch("/api/site/sections"),
          fetch("/api/visitors"),
        ]);

        const [
          projData,
          contactData,
          skillsData,
          sectionsData,
          visitorsData,
        ] = await Promise.all([
          projRes.json(),
          contactRes.json(),
          skillsRes.json(),
          sectionsRes.json(),
          visitorsRes.json(),
        ]);

        const raw = projData || [];
        setProjects(
          raw.map((p: Project) => {
            const images = Array.isArray(p.images)
              ? p.images
              : p.Screenshots
                ? [p.Screenshots].filter(Boolean)
                : [];
            return {
              ...p,
              images,
              defaultImageIndex: Math.min(
                p.defaultImageIndex ?? 0,
                Math.max(0, images.length - 1)
              ),
            };
          })
        );
        setContact({
          email: contactData?.email || "",
          phone: contactData?.phone || "",
          facebook: contactData?.facebook || "",
          linkedin: contactData?.linkedin || "",
          github: contactData?.github || "",
          twitter: contactData?.twitter || "",
          location: contactData?.location || "",
        });
        const cats = skillsData?.categories ?? {};
        setSkills({
          categories: {
            frontend: cats.frontend ?? { title: "Frontend Development", description: "Building fast, accessible, and delightful user interfaces.", skills: [] },
            backend: cats.backend ?? { title: "Backend Development", description: "Designing robust APIs and services that scale.", skills: [] },
            database: cats.database ?? { title: "Database", description: "Modeling data for reliability, performance, and simplicity.", skills: [] },
            cloudDevops: cats.cloudDevops ?? { title: "Cloud & DevOps", description: "Automating deployment and infrastructure for modern teams.", skills: [] },
          },
        });

        if (Array.isArray(sectionsData?.enabledSections)) {
          setEnabledSections(sectionsData.enabledSections);
        }

        if (Array.isArray(visitorsData?.visitors)) {
          setVisitors(visitorsData.visitors);
        }
        if (visitorsData?.sectionTotals) {
          setSectionTotals(visitorsData.sectionTotals);
        }
        if (Array.isArray(visitorsData?.dailyTrend)) {
          setDailyTrend(visitorsData.dailyTrend);
        }
      } catch (e) {
        console.error(e);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    const fetchDaily = async () => {
      setDailyChartLoading(true);
      try {
        const res = await fetch(`/api/visitors/daily?range=${visitRange}`);
        const data = await res.json();
        if (res.ok && data.labels && data.values) {
          setDailyChartData({ labels: data.labels, values: data.values });
        }
      } catch {
        setDailyChartData({ labels: [], values: [] });
      } finally {
        setDailyChartLoading(false);
      }
    };
    fetchDaily();
  }, [visitRange]);

  const resetProjectForm = () => {
    setNewProject({
      title: "",
      description: "",
      technologies: [],
      images: [],
      defaultImageIndex: 0,
      link: "",
      codeUrl: "",
      categories: [],
    });
    setEditingProject(null);
  };

  const handleCreateProject = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: newProject.title,
        description: newProject.description,
        technologies: newProject.technologies.filter(Boolean),
        images: newProject.images ?? [],
        defaultImageIndex: newProject.defaultImageIndex ?? 0,
        link: newProject.link,
        codeUrl: newProject.codeUrl ?? "",
        categories: newProject.categories ?? [],
      };
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create project");
      }
      const normalized = {
        ...data,
        images: data.images ?? [],
        defaultImageIndex: data.defaultImageIndex ?? 0,
      };
      setProjects((prev) => [normalized, ...prev]);
      resetProjectForm();
    } catch (e) {
      console.error(e);
      setError("Failed to create project");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (id?: string) => {
    if (!id) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (e) {
      console.error(e);
      setError("Failed to delete project");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveContact = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/site/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });
      if (!res.ok) throw new Error();
    } catch (e) {
      console.error(e);
      setError("Failed to save contact info");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSkills = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/site/skills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skills),
      });
      if (!res.ok) throw new Error();
    } catch (e) {
      console.error(e);
      setError("Failed to save skills");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const fileList = Array.from(files);
    setUploadingImage(true);
    setError(null);
    try {
      const uploadOne = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/uploads/project-image", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to upload image");
        return data.url;
      };

      const urls = await Promise.all(fileList.map(uploadOne));

      setNewProject((p) => {
        const images = [...(p.images ?? []), ...urls];
        return {
          ...p,
          images,
          defaultImageIndex: p.defaultImageIndex ?? 0,
        };
      });
    } catch (err) {
      console.error(err);
      setError("Failed to upload image(s)");
    } finally {
      setUploadingImage(false);
    }
    e.target.value = "";
  };

  const [imageUrlInput, setImageUrlInput] = useState("");
  const handleAddImageUrl = (url?: string) => {
    const trimmed = (url ?? imageUrlInput).trim();
    if (!trimmed) return;
    setNewProject((p) => {
      const images = [...(p.images ?? []), trimmed];
      return { ...p, images, defaultImageIndex: p.defaultImageIndex ?? 0 };
    });
    setImageUrlInput("");
  };

  const handleRemoveImage = (index: number) => {
    setNewProject((p) => {
      const images = (p.images ?? []).filter((_, i) => i !== index);
      const defaultImageIndex = Math.min(
        p.defaultImageIndex ?? 0,
        Math.max(0, images.length - 1)
      );
      return { ...p, images, defaultImageIndex };
    });
  };

  const handleSetDefaultImage = (index: number) => {
    setNewProject((p) => ({ ...p, defaultImageIndex: index }));
  };

  const handleEditProject = async (project: Project) => {
    const id = project._id;
    if (!id) return;
    try {
      const res = await fetch(`/api/projects/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to load project");
      const images = Array.isArray(data.images)
        ? data.images
        : data.Screenshots
          ? [data.Screenshots].filter(Boolean)
          : [];
      setNewProject({
        title: data.title ?? "",
        description: data.description ?? "",
        technologies: data.technologies ?? [],
        images,
        defaultImageIndex: Math.min(
          data.defaultImageIndex ?? 0,
          Math.max(0, images.length - 1)
        ),
        link: data.link ?? "",
        codeUrl: data.codeUrl ?? "",
        categories: data.categories ?? [],
      });
      setEditingProject({ ...data, _id: id });
    } catch (e) {
      console.error(e);
      setError("Failed to load project for editing");
    }
  };

  const handleUpdateProject = async () => {
    const id = editingProject?._id;
    if (!id) return;
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: newProject.title,
        description: newProject.description,
        technologies: newProject.technologies.filter(Boolean),
        images: newProject.images ?? [],
        defaultImageIndex: newProject.defaultImageIndex ?? 0,
        link: newProject.link,
        codeUrl: newProject.codeUrl ?? "",
        categories: newProject.categories ?? [],
      };
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update project");
      setProjects((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, ...payload, _id: id } : p
        )
      );
      resetProjectForm();
    } catch (e) {
      console.error(e);
      setError("Failed to update project");
    } finally {
      setSaving(false);
    }
  };

  const parseList = (value: string) =>
    value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  const [skillsDropdownOpen, setSkillsDropdownOpen] = useState<Record<string, boolean>>({});
  const [technologiesDropdownOpen, setTechnologiesDropdownOpen] = useState(false);

  useEffect(() => {
    const ids = ["overview", "content", "visitors", "settings"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = (entry.target as HTMLElement).id as
            | "overview"
            | "content"
            | "visitors"
            | "settings"
            | undefined;
          if (id) setActiveSection(id);
        });
      },
      { threshold: 0.35 }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const sectionLabels: Record<string, string> = {
    hero: "Hero",
    projects: "Projects",
    skills: "Skills",
    contact: "Contact",
    footer: "Footer",
  };

  const sectionVisitsForChart = ["hero", "projects", "skills", "contact", "footer"].map(
    (key) => ({
      label: sectionLabels[key] ?? key,
      value: sectionTotals[key] ?? 0,
    })
  );

  const maxSectionValue = Math.max(
    ...sectionVisitsForChart.map((s) => s.value),
    1
  );

  const exportVisitorsCSV = () => {
    const headers = [
      "visitorId",
      "visitorName",
      "totalVisits",
      "lastVisit",
      "hero",
      "projects",
      "skills",
      "contact",
      "footer",
    ];
    const rows = visitors.map((v) => [
      v.visitorId,
      v.visitorName,
      v.totalVisits,
      v.lastVisit,
      v.sectionVisits?.hero ?? 0,
      v.sectionVisits?.projects ?? 0,
      v.sectionVisits?.skills ?? 0,
      v.sectionVisits?.contact ?? 0,
      v.sectionVisits?.footer ?? 0,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `visitors-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportVisitorsJSON = () => {
    const blob = new Blob([JSON.stringify(visitors, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `visitors-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  function formatLastVisit(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? "s" : ""}`;
    return date.toLocaleDateString();
  }

  const toggleSectionEnabled = async (section: string) => {
    const next = enabledSections.includes(section)
      ? enabledSections.filter((s) => s !== section)
      : [...enabledSections, section];
    setEnabledSections(next);
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/site/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabledSections: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save sections");
    } catch (e) {
      console.error(e);
      setError("Failed to save visible sections");
      setEnabledSections(enabledSections);
    } finally {
      setSaving(false);
    }
  };

  const scrollToSection = (
    id: "overview" | "content" | "visitors" | "settings"
  ) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 text-slate-100">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
      >
        <div className="absolute -top-32 left-16 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-80 w-80 rounded-full bg-purple-600/25 blur-3xl" />
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

      <div className="relative flex min-h-screen">
        {/* Sidebar - fixed so it stays visible on scroll */}
        <aside
          className={`fixed inset-y-3 left-3 z-40 w-64 rounded-3xl border border-white/10 bg-slate-950/85 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.95)] backdrop-blur-2xl transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-[110%] md:translate-x-0"
          }`}
        >
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div className="inline-flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-500 to-purple-500 text-xs font-bold text-slate-950 shadow-[0_0_30px_rgba(56,189,248,0.9)]">
                YA
              </span>
              <div className="leading-tight">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  Admin
                </p>
                <p className="text-sm font-semibold text-slate-50">
                  Portfolio Dashboard
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-5 text-xs text-slate-300">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                Overview
              </p>
              <button
                type="button"
                onClick={() => scrollToSection("overview")}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-colors ${
                  activeSection === "overview"
                    ? "bg-cyan-500/15 text-cyan-200"
                    : "hover:bg-slate-900/80"
                }`}
              >
                <span>Dashboard</span>
                {activeSection === "overview" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                )}
              </button>
            </div>

            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                Sections
              </p>
              {[
                "Hero",
                "Projects",
                "Skills / Tech Stack",
                "Contact",
                "Footer",
              ].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => scrollToSection("content")}
                  className={`mb-1.5 flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-colors ${
                    activeSection === "content"
                      ? "bg-slate-900/80 text-slate-100"
                      : "hover:bg-slate-900/70"
                  }`}
                >
                  <span>{label}</span>
                  {activeSection === "content" && (
                    <span className="h-[1px] w-6 bg-gradient-to-r from-cyan-400/80 to-purple-500/70" />
                  )}
                </button>
              ))}
            </div>

            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                Analytics &amp; Settings
              </p>
              <button
                type="button"
                onClick={() => scrollToSection("visitors")}
                className={`mb-1.5 flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-colors ${
                  activeSection === "visitors"
                    ? "bg-cyan-500/15 text-cyan-200"
                    : "hover:bg-slate-900/80"
                }`}
              >
                <span>Visitors Statistics</span>
                {activeSection === "visitors" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                )}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("settings")}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-colors ${
                  activeSection === "settings"
                    ? "bg-cyan-500/15 text-cyan-200"
                    : "hover:bg-slate-900/80"
                }`}
              >
                <span>Settings</span>
                {activeSection === "settings" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                )}
              </button>
            </div>
          </div>
        </aside>

        {/* Main area - left margin so content doesn't sit under fixed sidebar on desktop */}
        <div className="flex-1 pl-0 md:pl-[17rem]">
          <div className="mx-auto max-w-6xl px-4 pt-2 pb-4 sm:pt-3 sm:pb-6 lg:pb-8">
            {/* Top bar */}
            <header className="mb-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  Portfolio control center
                </p>
                <h1 className="mt-0.5 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                  Dashboard
                  <span className="ml-2 bg-gradient-to-r from-cyan-400 via-sky-500 to-purple-500 bg-clip-text text-base font-normal text-transparent sm:text-lg">
                    · Yassine Aalouch
                  </span>
                </h1>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5 text-xs text-slate-300 shadow-[0_12px_32px_rgba(15,23,42,0.9)] backdrop-blur-lg sm:flex">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] text-slate-400">
                    /
                  </span>
                  <span>Quick search (coming soon)</span>
                </div>
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-slate-950/80 text-slate-200 shadow-[0_0_20px_rgba(15,23,42,0.9)] outline-none transition hover:border-cyan-400/80 hover:text-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  <span className="block h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
                </button>
                <button
                  type="button"
                  className="hidden items-center gap-2 rounded-full border border-white/10 bg-slate-950/80 px-3 py-1.5 text-xs font-medium text-slate-200 shadow-[0_12px_32px_rgba(15,23,42,0.9)] backdrop-blur-lg sm:inline-flex"
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 via-sky-500 to-purple-500 text-[10px] font-semibold text-slate-950">
                    YA
                  </span>
                  <span>Logout</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSidebarOpen((prev) => !prev)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-slate-950/80 text-slate-200 shadow-[0_0_20px_rgba(15,23,42,0.9)] outline-none transition hover:border-cyan-400/80 hover:text-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 md:hidden"
                >
                  <span className="relative block h-3.5 w-4">
                    <span
                      className={`absolute left-0 h-[1.5px] w-full origin-center bg-current transition-transform duration-200 ${
                        sidebarOpen
                          ? "translate-y-[6px] rotate-45"
                          : "translate-y-0"
                      }`}
                    />
                    <span
                      className={`absolute left-0 h-[1.5px] w-full bg-current transition-opacity duration-150 ${
                        sidebarOpen ? "opacity-0" : "opacity-80"
                      }`}
                    />
                    <span
                      className={`absolute left-0 h-[1.5px] w-full origin-center bg-current transition-transform duration-200 ${
                        sidebarOpen
                          ? "-translate-y-[6px] -rotate-45"
                          : "translate-y-[6px]"
                      }`}
                    />
                  </span>
                </button>
              </div>
            </header>

            {error && (
              <div className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            {/* Overview */}
            <section id="overview" className="mb-10 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-slate-500">
                  Overview
                </h2>
                <p className="text-xs text-slate-400">
                  {loading
                    ? "Loading data from API…"
                    : saving
                    ? "Saving changes…"
                    : "Synced with live portfolio."}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="dashboard-card relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.9)] backdrop-blur-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-indigo-500/10 to-transparent opacity-60" />
                  <div className="relative space-y-1">
                    <p className="text-xs text-slate-400">Projects</p>
                    <p className="text-2xl font-semibold text-slate-50">
                      {projects.length}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Synced with Projects section
                    </p>
                  </div>
                </div>

                <div className="dashboard-card relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.9)] backdrop-blur-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-emerald-400/10 to-transparent opacity-60" />
                  <div className="relative space-y-1">
                    <p className="text-xs text-slate-400">Skills entries</p>
                    <p className="text-2xl font-semibold text-slate-50">
                      {Object.values(skills.categories).reduce(
                        (sum, c) => sum + (c?.skills?.length ?? 0),
                        0
                      )}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Design · Languages · Knowledge
                    </p>
                  </div>
                </div>

                <div className="dashboard-card relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.9)] backdrop-blur-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 via-cyan-500/10 to-transparent opacity-60" />
                  <div className="relative space-y-2">
                    <p className="text-xs text-slate-400">Status</p>
                    <p className="text-sm font-semibold text-emerald-300">
                      {loading
                        ? "Loading"
                        : saving
                        ? "Saving changes"
                        : "Synced"}
                    </p>
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
                      <span className="text-[11px] text-slate-400">
                        API status healthy
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Content management */}
            <section id="content" className="mb-10 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-slate-500">
                  Content management
                </h2>
                <p className="text-xs text-slate-400">
                  Update portfolio sections and sync changes in real time.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
                {/* Projects */}
                <section className="rounded-2xl border border-white/10 bg-slate-950/80 p-5 shadow-[0_20px_55px_rgba(15,23,42,0.96)] backdrop-blur-2xl">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-slate-50">
                        Projects
                      </h3>
                      <p className="text-xs text-slate-400">
                        Add, update and remove portfolio projects.
                      </p>
                    </div>
                    <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-cyan-300">
                      Linked to Projects
                    </span>
                  </div>

                  <div className="mb-5 space-y-3">
                    <input
                      className="w-full rounded-lg border border-slate-700/70 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/70"
                      placeholder="Title"
                      value={newProject.title}
                      onChange={(e) =>
                        setNewProject((p) => ({ ...p, title: e.target.value }))
                      }
                    />
                    <textarea
                      className="w-full rounded-lg border border-slate-700/70 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/70"
                      placeholder="Description"
                      value={newProject.description}
                      onChange={(e) =>
                        setNewProject((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                    />
                    <div>
                      <p className="mb-1.5 text-xs font-medium text-slate-300">Technologies</p>
                      <TechnologiesDropdown
                        selected={newProject.technologies ?? []}
                        onToggle={(tech) => {
                          const current = newProject.technologies ?? [];
                          const next = current.includes(tech)
                            ? current.filter((t) => t !== tech)
                            : [...current, tech];
                          setNewProject((p) => ({ ...p, technologies: next }));
                        }}
                        isOpen={technologiesDropdownOpen}
                        onToggleOpen={() =>
                          setTechnologiesDropdownOpen((o) => !o)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-slate-300">Images (première = affichée par défaut)</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="inline-flex cursor-pointer items-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <span className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-[11px] text-cyan-300">
                            Upload (plusieurs)
                          </span>
                        </label>
                        <input
                          className="flex-1 min-w-[120px] rounded-lg border border-slate-700/70 bg-slate-950/70 px-2 py-1.5 text-xs text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/70"
                          placeholder="Ou coller une URL"
                          value={imageUrlInput}
                          onChange={(e) => setImageUrlInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddImageUrl();
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleAddImageUrl()}
                          className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-2 py-1.5 text-[11px] text-cyan-300 hover:bg-cyan-500/20"
                        >
                          Add
                        </button>
                      </div>
                      {uploadingImage && (
                        <span className="text-[11px] text-cyan-300">Upload en cours…</span>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {(newProject.images ?? []).map((url, i) => (
                          <div
                            key={`${url}-${i}`}
                            className="group relative flex items-center gap-1 rounded-lg border border-slate-700/70 bg-slate-900/80 p-1.5"
                          >
                            <div
                              className="h-10 w-10 rounded bg-slate-800 bg-cover bg-center"
                              style={{ backgroundImage: `url(${url})` }}
                            />
                            <span className="max-w-[80px] truncate text-[10px] text-slate-400">
                              {(newProject.defaultImageIndex ?? 0) === i ? "★" : ""} #{i + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleSetDefaultImage(i)}
                              className="rounded px-1.5 py-0.5 text-[10px] text-cyan-400 hover:bg-cyan-500/20"
                              title="Définir par défaut"
                            >
                              ★
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(i)}
                              className="rounded px-1.5 py-0.5 text-[10px] text-red-400 hover:bg-red-500/20"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <input
                      className="w-full rounded-lg border border-slate-700/70 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/70"
                      placeholder="Project link (Live Demo)"
                      value={newProject.link}
                      onChange={(e) =>
                        setNewProject((p) => ({
                          ...p,
                          link: e.target.value,
                        }))
                      }
                    />
                    <input
                      className="w-full rounded-lg border border-slate-700/70 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/70"
                      placeholder="Code URL (optional)"
                      value={newProject.codeUrl ?? ""}
                      onChange={(e) =>
                        setNewProject((p) => ({
                          ...p,
                          codeUrl: e.target.value,
                        }))
                      }
                    />
                    <input
                      className="w-full rounded-lg border border-slate-700/70 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/70"
                      placeholder="Categories (e.g. full-stack, web-apps, open-source, experiments)"
                      value={(newProject.categories ?? []).join(", ")}
                      onChange={(e) =>
                        setNewProject((p) => ({
                          ...p,
                          categories: parseList(e.target.value),
                        }))
                      }
                    />
                    <div className="flex flex-wrap gap-2">
                      {editingProject ? (
                        <>
                          <button
                            onClick={handleUpdateProject}
                            disabled={saving}
                            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-slate-50 shadow-[0_0_26px_rgba(56,189,248,0.7)] transition hover:shadow-[0_0_36px_rgba(56,189,248,0.95)] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {saving ? "Saving…" : "Save"}
                          </button>
                          <button
                            onClick={resetProjectForm}
                            disabled={saving}
                            className="inline-flex items-center justify-center rounded-full border border-slate-600 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleCreateProject}
                          disabled={saving}
                          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-slate-50 shadow-[0_0_26px_rgba(56,189,248,0.7)] transition hover:shadow-[0_0_36px_rgba(56,189,248,0.95)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {saving ? "Adding…" : "Add Project"}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="max-h-80 space-y-2 overflow-y-auto pr-1 text-sm scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700/80">
                    {projects.map((project) => (
                      <div
                        key={project._id}
                        className="flex items-start justify-between gap-3 rounded-xl border border-slate-700/70 bg-slate-950/90 p-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-100">
                            {project.title}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-xs text-slate-400">
                            {project.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditProject(project)}
                            className="text-[11px] font-medium text-cyan-400 transition hover:text-cyan-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project._id)}
                            className="text-[11px] font-medium text-red-400 transition hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Contact info */}
                <section className="rounded-2xl border border-white/10 bg-slate-950/80 p-5 shadow-[0_20px_55px_rgba(15,23,42,0.96)] backdrop-blur-2xl">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-slate-50">
                        Contact Info
                      </h3>
                      <p className="text-xs text-slate-400">
                        Controls footer + contact section links.
                      </p>
                    </div>
                    <span className="rounded-full bg-purple-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-purple-300">
                      Linked to Contact
                    </span>
                  </div>
                  <div className="space-y-2">
                    <input
                      className="w-full rounded-lg border border-slate-700/70 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/70"
                      placeholder="Email"
                      value={contact.email}
                      onChange={(e) =>
                        setContact((c) => ({ ...c, email: e.target.value }))
                      }
                    />
                    <input
                      className="w-full rounded-lg border border-slate-700/70 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/70"
                      placeholder="Phone"
                      value={contact.phone}
                      onChange={(e) =>
                        setContact((c) => ({ ...c, phone: e.target.value }))
                      }
                    />
                    <input
                      className="w-full rounded-lg border border-slate-700/70 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/70"
                      placeholder="Facebook URL"
                      value={contact.facebook}
                      onChange={(e) =>
                        setContact((c) => ({ ...c, facebook: e.target.value }))
                      }
                    />
                    <input
                      className="w-full rounded-lg border border-slate-700/70 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/70"
                      placeholder="LinkedIn URL"
                      value={contact.linkedin}
                      onChange={(e) =>
                        setContact((c) => ({ ...c, linkedin: e.target.value }))
                      }
                    />
                    <input
                      className="w-full rounded-lg border border-slate-700/70 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/70"
                      placeholder="GitHub URL"
                      value={contact.github}
                      onChange={(e) =>
                        setContact((c) => ({ ...c, github: e.target.value }))
                      }
                    />
                    <input
                      className="w-full rounded-lg border border-slate-700/70 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/70"
                      placeholder="Twitter/X URL"
                      value={contact.twitter}
                      onChange={(e) =>
                        setContact((c) => ({ ...c, twitter: e.target.value }))
                      }
                    />
                    <input
                      className="w-full rounded-lg border border-slate-700/70 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/70"
                      placeholder="Location (e.g. Paris · Open to remote)"
                      value={contact.location}
                      onChange={(e) =>
                        setContact((c) => ({ ...c, location: e.target.value }))
                      }
                    />
                    <button
                      onClick={handleSaveContact}
                      disabled={saving}
                      className="mt-1 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-violet-500 px-4 py-2 text-sm font-semibold text-slate-50 shadow-[0_0_26px_rgba(168,85,247,0.7)] transition hover:shadow-[0_0_36px_rgba(168,85,247,0.95)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Save Contact
                    </button>
                  </div>
                </section>
              </div>

              {/* Skills */}
              <section className="rounded-2xl border border-white/10 bg-slate-950/80 p-5 shadow-[0_20px_55px_rgba(15,23,42,0.96)] backdrop-blur-2xl">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-50">
                      Skills &amp; Tech Stack
                    </h3>
                    <p className="text-xs text-slate-400">
                      Contenu des 4 cartes de la section Skills sur la homepage.
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-emerald-300">
                    Linked to Skills
                  </span>
                </div>
                <div className="grid gap-5 text-sm md:grid-cols-2">
                  {(["frontend", "backend", "database", "cloudDevops"] as const).map((key) => {
                    const cat = skills.categories[key] ?? { title: "", description: "", skills: [] };
                    return (
                      <div
                        key={key}
                        className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-4"
                      >
                        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                          {key === "cloudDevops" ? "Cloud & DevOps" : key}
                        </p>
                        <input
                          className="mb-2 w-full rounded-lg border border-slate-700/70 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/70"
                          placeholder="Titre (ex: Frontend Development)"
                          value={cat.title}
                          onChange={(e) =>
                            setSkills((s) => ({
                              ...s,
                              categories: {
                                ...s.categories,
                                [key]: { ...cat, title: e.target.value },
                              },
                            }))
                          }
                        />
                        <input
                          className="mb-2 w-full rounded-lg border border-slate-700/70 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/70"
                          placeholder="Description"
                          value={cat.description}
                          onChange={(e) =>
                            setSkills((s) => ({
                              ...s,
                              categories: {
                                ...s.categories,
                                [key]: { ...cat, description: e.target.value },
                              },
                            }))
                          }
                        />
                        <SkillsDropdown
                          category={key}
                          selected={cat.skills ?? []}
                          onToggle={(skill) => {
                            const current = cat.skills ?? [];
                            const next = current.includes(skill)
                              ? current.filter((s) => s !== skill)
                              : [...current, skill];
                            setSkills((s) => ({
                              ...s,
                              categories: {
                                ...s.categories,
                                [key]: { ...cat, skills: next },
                              },
                            }));
                          }}
                          openKey={key}
                          isOpen={skillsDropdownOpen[key] ?? false}
                          onToggleOpen={() =>
                            setSkillsDropdownOpen((o) => ({ ...o, [key]: !o[key] }))
                          }
                        />
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={handleSaveSkills}
                  disabled={saving}
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_0_26px_rgba(52,211,153,0.7)] transition hover:shadow-[0_0_36px_rgba(52,211,153,0.95)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Save Skills
                </button>
              </section>
            </section>

            {/* Visitors statistics */}
            <section id="visitors" className="mb-10 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-slate-500">
                  Visitors statistics
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <button
                    type="button"
                    onClick={exportVisitorsCSV}
                    className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 shadow-[0_10px_28px_rgba(15,23,42,0.9)] backdrop-blur-lg hover:border-cyan-400/70 hover:text-cyan-200"
                  >
                    Export CSV
                  </button>
                  <button
                    type="button"
                    onClick={exportVisitorsJSON}
                    className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 shadow-[0_10px_28px_rgba(15,23,42,0.9)] backdrop-blur-lg hover:border-cyan-400/70 hover:text-cyan-200"
                  >
                    Export JSON
                  </button>
                </div>
              </div>

              {/* Visites par projet */}
              <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-[0_20px_55px_rgba(15,23,42,0.96)] backdrop-blur-2xl">
                <p className="text-xs font-medium text-slate-300">
                  Visites par projet
                </p>
                <p className="text-[11px] text-slate-500">
                  Nombre de visites et visiteurs uniques pour chaque page projet.
                </p>
                <div className="mt-3 space-y-2">
                  {projects.map((p) => (
                    <div
                      key={p._id}
                      className="rounded-lg border border-slate-700/50 bg-slate-900/50 px-3 py-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium text-slate-200">
                          {p.title}
                        </span>
                        <div className="flex flex-wrap gap-3 text-[11px]">
                          <span className="text-cyan-300">
                            <span className="font-semibold">{(p.visits ?? 0)}</span> visite{(p.visits ?? 0) !== 1 ? "s" : ""}
                          </span>
                          <span className="text-emerald-300">
                            <span className="font-semibold">{(p.uniqueVisitors ?? 0)}</span>{" "}
                            {(p.uniqueVisitors ?? 0) !== 1 ? "visiteurs uniques" : "visiteur unique"}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-4 border-t border-slate-700/50 pt-2 text-[11px]">
                        <span className="text-sky-300">
                          Demo: <span className="font-semibold">{(p.demoVisits ?? 0)}</span> clic{(p.demoVisits ?? 0) !== 1 ? "s" : ""}
                          {" · "}
                          <span className="font-semibold">{(p.demoUniqueVisitors ?? 0)}</span>{" "}
                          {(p.demoUniqueVisitors ?? 0) !== 1 ? "visiteurs uniques" : "visiteur unique"}
                        </span>
                        <span className="text-amber-300">
                          Code: <span className="font-semibold">{(p.codeVisits ?? 0)}</span> clic{(p.codeVisits ?? 0) !== 1 ? "s" : ""}
                          {" · "}
                          <span className="font-semibold">{(p.codeUniqueVisitors ?? 0)}</span>{" "}
                          {(p.codeUniqueVisitors ?? 0) !== 1 ? "visiteurs uniques" : "visiteur unique"}
                        </span>
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <p className="py-4 text-center text-xs text-slate-500">
                      Aucun projet
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)]">
                {/* Line chart */}
                <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-[0_20px_55px_rgba(15,23,42,0.96)] backdrop-blur-2xl">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-slate-300">
                        Visits over time
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {visitRange === "7"
                          ? "Derniers 7 jours"
                          : visitRange === "30"
                          ? "Derniers 30 jours"
                          : "Derniers 90 jours"}{" "}
                        · données réelles
                      </p>
                    </div>
                    <select
                      value={visitRange}
                      onChange={(e) =>
                        setVisitRange(
                          e.target.value as "7" | "30" | "90"
                        )
                      }
                      disabled={dailyChartLoading}
                      className="rounded-full border border-slate-700/70 bg-slate-950/80 px-2.5 py-1 text-xs text-slate-300 outline-none transition focus:border-cyan-400/70 disabled:opacity-60"
                    >
                      <option value="7">Last 7 days</option>
                      <option value="30">Last 30 days</option>
                      <option value="90">Last 90 days</option>
                    </select>
                  </div>
                  <div className="relative mt-1 min-h-[10rem] w-full overflow-hidden rounded-xl bg-gradient-to-b from-slate-900/80 via-slate-950/90 to-black">
                    {dailyChartLoading ? (
                      <div className="flex h-40 items-center justify-center text-xs text-slate-500">
                        Chargement…
                      </div>
                    ) : !dailyChartData.values.length ? (
                      <div className="flex h-40 items-center justify-center text-xs text-slate-500">
                        Aucune visite sur cette période
                      </div>
                    ) : (
                      <>
                        <div className="absolute inset-0 opacity-40">
                          <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),transparent_60%)]" />
                        </div>
                        <div className="relative flex h-40 flex-col">
                          <div className="flex h-32 flex-1 items-end gap-1 px-2 pb-0 pt-2">
                            {dailyChartData.values.map((value, index) => {
                              const max = Math.max(
                                ...dailyChartData.values,
                                1
                              );
                              const pct =
                                max > 0 ? (value / max) * 100 : 0;
                              const barHeight =
                                value > 0 ? Math.max(pct, 8) : 0;
                              return (
                                <div
                                  key={`${dailyChartData.labels[index]}-${index}`}
                                  className="group flex flex-1 flex-col items-center gap-1"
                                  title={`${dailyChartData.labels[index] ?? ""}: ${value} visit(s)`}
                                >
                                  <div
                                    className="flex w-full flex-1 items-end justify-center"
                                    style={{ minHeight: 80 }}
                                  >
                                    <div
                                      className="w-full min-w-[6px] max-w-[24px] rounded-t bg-gradient-to-t from-cyan-500 via-sky-500 to-purple-500 shadow-[0_0_12px_rgba(56,189,248,0.8)] transition-all duration-300 group-hover:opacity-90"
                                      style={{
                                        height: `${barHeight}%`,
                                        minHeight:
                                          value > 0 ? "6px" : undefined,
                                      }}
                                    />
                                  </div>
                                  {dailyChartData.labels[index] && (
                                    <span className="mt-1 shrink-0 text-[10px] text-slate-500">
                                      {dailyChartData.labels[index]}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Bar chart + summary */}
                <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-[0_20px_55px_rgba(15,23,42,0.96)] backdrop-blur-2xl">
                  <p className="text-xs font-medium text-slate-300">
                    Section-wise visits
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Relative interest in portfolio sections.
                  </p>
                  <div className="mt-3 space-y-2">
                    {sectionVisitsForChart.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center gap-3 text-xs text-slate-300"
                      >
                        <span className="w-20 text-slate-400">
                          {item.label}
                        </span>
                        <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-slate-900">
                          <div
                            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-purple-500"
                            style={{
                              width: `${(item.value / maxSectionValue) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="w-10 text-right text-[11px] text-slate-400">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Visitors table */}
              <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-[0_20px_55px_rgba(15,23,42,0.96)] backdrop-blur-2xl">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-xs font-medium text-slate-300">
                    Visiteurs récents
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Visiteurs enregistrés via localStorage + API.
                  </p>
                </div>
                <div className="overflow-x-auto text-xs sm:text-sm">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="text-left text-[11px] uppercase tracking-[0.16em] text-slate-500">
                        <th className="border-b border-slate-800/80 pb-2 pr-4">
                          Visitor
                        </th>
                        <th className="border-b border-slate-800/80 pb-2 pr-4">
                          Visits
                        </th>
                        <th className="border-b border-slate-800/80 pb-2 pr-4">
                          Last visit
                        </th>
                        <th className="border-b border-slate-800/80 pb-2 text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {visitors.map((visitor) => (
                        <tr
                          key={visitor.visitorId}
                          className="group border-b border-slate-900/80 last:border-0 hover:bg-slate-900/70"
                        >
                          <td className="py-2.5 pr-4 text-slate-200">
                            {visitor.visitorName}
                          </td>
                          <td className="py-2.5 pr-4 text-slate-300">
                            {visitor.totalVisits}
                          </td>
                          <td className="py-2.5 pr-4 text-slate-400">
                            {formatLastVisit(visitor.lastVisit)}
                          </td>
                          <td className="py-2.5 text-right">
                            <span
                              className="inline-block rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-[11px] font-medium text-slate-400"
                              title={Object.entries(
                                visitor.sectionVisits ?? {}
                              )
                                .filter(([, v]) => v > 0)
                                .map(
                                  ([s, v]) =>
                                    `${sectionLabels[s] ?? s}: ${v}`
                                )
                                .join(", ")}
                            >
                              {Object.values(
                                visitor.sectionVisits ?? {}
                              ).reduce((a, b) => a + b, 0)}{" "}
                              sections
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Settings */}
            <section id="settings" className="mb-16 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-slate-500">
                  Settings
                </h2>
                <p className="text-xs text-slate-400">
                  Configure theme, visible sections, and social links.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {/* Theme */}
                <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-[0_20px_55px_rgba(15,23,42,0.96)] backdrop-blur-2xl">
                  <p className="text-xs font-medium text-slate-300">Theme</p>
                  <p className="text-[11px] text-slate-500">
                    Preview how the portfolio looks in each mode.
                  </p>
                  <div className="mt-3 flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setTheme("dark")}
                      className={`flex-1 rounded-full border px-3 py-1.5 ${
                        theme === "dark"
                          ? "border-cyan-400/70 bg-slate-950 text-cyan-200"
                          : "border-white/10 bg-slate-900 text-slate-300"
                      }`}
                    >
                      Dark
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme("light")}
                      className={`flex-1 rounded-full border px-3 py-1.5 ${
                        theme === "light"
                          ? "border-cyan-400/70 bg-slate-950 text-cyan-200"
                          : "border-white/10 bg-slate-900 text-slate-300"
                      }`}
                    >
                      Light
                    </button>
                  </div>
                  <p className="mt-3 text-[11px] text-slate-500">
                    Current preview:{" "}
                    <span className="text-slate-300">{theme} mode</span> (visual
                    only, not yet wired to live site).
                  </p>
                </div>

                {/* Sections toggle */}
                <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-[0_20px_55px_rgba(15,23,42,0.96)] backdrop-blur-2xl">
                  <p className="text-xs font-medium text-slate-300">
                    Visible sections
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Choose which sections are enabled on the public portfolio.
                  </p>
                  <div className="mt-3 space-y-2 text-xs">
                    {["hero", "projects", "skills", "contact", "footer"].map(
                      (section) => (
                        <label
                          key={section}
                          className="flex items-center justify-between rounded-xl bg-slate-950/80 px-3 py-2 text-slate-300"
                        >
                          <span className="capitalize">
                            {section === "skills"
                              ? "Skills / Tech Stack"
                              : section}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleSectionEnabled(section)}
                            className={`inline-flex h-5 w-9 items-center rounded-full border px-0.5 transition ${
                              enabledSections.includes(section)
                                ? "border-cyan-400/70 bg-cyan-500/30"
                                : "border-slate-600 bg-slate-900"
                            }`}
                          >
                            <span
                              className={`h-4 w-4 rounded-full bg-slate-100 shadow-sm transition-transform ${
                                enabledSections.includes(section)
                                  ? "translate-x-3"
                                  : "translate-x-0"
                              }`}
                            />
                          </button>
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* Social links note */}
                <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-[0_20px_55px_rgba(15,23,42,0.96)] backdrop-blur-2xl">
                  <p className="text-xs font-medium text-slate-300">
                    Social links
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Social URLs are managed from the Contact Info card above and
                    automatically reused in the Footer and Contact sections.
                  </p>
                  <div className="mt-3 space-y-1 text-[11px] text-slate-400">
                    <p>
                      • Update{" "}
                      <span className="text-slate-200">LinkedIn</span>,
                      <span className="text-slate-200"> GitHub</span>, and{" "}
                      <span className="text-slate-200">Facebook</span> directly
                      in Contact Info.
                    </p>
                    <p>
                      • Changes are reflected across the portfolio after save.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

