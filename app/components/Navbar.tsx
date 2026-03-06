"use client";

import { useEffect, useRef, useState } from "react";

type NavItem = {
  id: string;
  label: string;
  targetId: string;
};

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", targetId: "home" },
  { id: "projects", label: "Projects", targetId: "projects" },
  { id: "skills", label: "Skills", targetId: "skills" },
  { id: "experience", label: "Experience", targetId: "experience" },
  { id: "contact", label: "Contact", targetId: "contact" },
];

const SECTION_TO_NAV: Record<string, string> = {
  hero: "home",
  projects: "projects",
  skills: "skills",
  contact: "contact",
};

function filterNavItems(
  items: NavItem[],
  enabledSections: string[] | undefined
): NavItem[] {
  if (!enabledSections?.length) return items;
  const allowedIds = new Set(
    enabledSections.map((s) => SECTION_TO_NAV[s]).filter(Boolean)
  );
  return items.filter((item) => allowedIds.has(item.targetId));
}

type NavbarProps = { enabledSections?: string[] };

export default function Navbar({ enabledSections }: NavbarProps) {
  const navItems = filterNavItems(NAV_ITEMS, enabledSections);
  const [active, setActive] = useState<string>("home");
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const ratiosRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.targetId);
    sectionIds.forEach((id) => {
      ratiosRef.current[id] = 0;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).id;
          if (!id) return;
          ratiosRef.current[id] = entry.isIntersecting
            ? entry.intersectionRatio
            : 0;
        });

        const best = sectionIds.reduce((a, b) =>
          (ratiosRef.current[a] ?? 0) >= (ratiosRef.current[b] ?? 0) ? a : b
        );
        if (ratiosRef.current[best] > 0) {
          setActive(best);
        }
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [enabledSections?.join(",") ?? ""]);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileOpen]);

  const handleNavClick = (item: NavItem) => {
    const el = document.getElementById(item.targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsMobileOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/80 via-slate-950/70 to-transparent" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <nav className="relative flex h-16 items-center justify-between rounded-b-2xl border border-white/10 border-t-transparent bg-slate-950/70 px-3 shadow-[0_18px_45px_rgba(15,23,42,0.9)] backdrop-blur-xl sm:px-4">
          {/* Logo / Brand */}
          <button
            type="button"
            onClick={() =>
              handleNavClick({ id: "home", label: "Home", targetId: "home" })
            }
            className="group inline-flex items-center gap-2 rounded-full border border-transparent bg-transparent px-2 py-1 text-left text-sm font-semibold tracking-tight text-slate-100 outline-none transition hover:border-slate-700/80 hover:bg-slate-900/70 sm:px-3"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-500 to-purple-500 text-xs font-bold text-slate-950 shadow-[0_0_30px_rgba(56,189,248,0.85)]">
              YA
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Software Engineer
              </span>
              <span className="text-sm text-slate-50 sm:text-base">
                Yassine Aalouch
              </span>
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden items-center gap-4 sm:gap-6 md:flex">
            <ul className="flex items-center gap-3 sm:gap-4">
              {navItems.map((item) => {
                const isActive = active === item.targetId;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleNavClick(item)}
                      className={`relative px-1.5 py-1 text-xs font-medium tracking-wide text-slate-300 transition-colors sm:text-sm ${
                        isActive
                          ? "text-cyan-300"
                          : "hover:text-slate-50 focus-visible:text-slate-50"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span
                        className={`pointer-events-none absolute inset-x-0 -bottom-1 h-[2px] origin-center rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-purple-500 transition-transform duration-200 ${
                          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>

            {(!enabledSections || enabledSections.includes("contact")) && (
              <button
                type="button"
                onClick={() =>
                  handleNavClick({
                    id: "contact",
                    label: "Contact",
                    targetId: "contact",
                  })
                }
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-1.5 text-xs font-medium text-slate-50 shadow-[0_0_22px_rgba(56,189,248,0.7)] transition hover:shadow-[0_0_32px_rgba(56,189,248,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:px-5 sm:py-2 sm:text-sm"
              >
                Hire Me
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileOpen((prev) => !prev)}
              aria-label="Toggle navigation"
              aria-expanded={isMobileOpen}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-slate-900/70 text-slate-100 shadow-[0_0_20px_rgba(15,23,42,0.9)] outline-none transition hover:border-cyan-400/70 hover:text-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <span className="relative flex h-3.5 w-4 items-center justify-center">
                <span
                  className={`absolute h-[1.5px] w-full origin-center bg-current transition-transform duration-200 ${
                    isMobileOpen ? "translate-y-[6px] rotate-45" : "-translate-y-[4px]"
                  }`}
                />
                <span
                  className={`absolute h-[1.5px] w-full bg-current transition-opacity duration-150 ${
                    isMobileOpen ? "opacity-0" : "opacity-80"
                  }`}
                />
                <span
                  className={`absolute h-[1.5px] w-full origin-center bg-current transition-transform duration-200 ${
                    isMobileOpen ? "-translate-y-[6px] -rotate-45" : "translate-y-[4px]"
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>

        {/* Mobile panel */}
        <div
          className={`md:hidden transition-[max-height,opacity] duration-300 ${
            isMobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mt-1 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 p-3 shadow-[0_18px_45px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
            <ul className="space-y-1.5">
              {navItems.map((item) => {
                const isActive = active === item.targetId;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleNavClick(item)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-cyan-500/15 text-cyan-300"
                          : "text-slate-200 hover:bg-slate-900/80 hover:text-slate-50"
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            {(!enabledSections || enabledSections.includes("contact")) && (
              <button
                type="button"
                onClick={() =>
                  handleNavClick({
                    id: "contact",
                    label: "Contact",
                    targetId: "contact",
                  })
                }
                className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-medium text-slate-50 shadow-[0_0_24px_rgba(56,189,248,0.65)] transition hover:shadow-[0_0_34px_rgba(56,189,248,0.9)]"
              >
                Hire Me
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

