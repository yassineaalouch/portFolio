"use client";

import { useEffect, useRef } from "react";

const STORAGE_KEY_ID = "portfolio_visitor_id";
const STORAGE_KEY_NAME = "portfolio_visitor_name";
const SECTION_DEBOUNCE_MS = 3000;

const SECTION_IDS: Record<string, string> = {
  hero: "home",
  projects: "projects",
  skills: "skills",
  contact: "contact",
  footer: "footer",
};

type VisitorTrackerProps = {
  enabledSections: string[];
};

export default function VisitorTracker({
  enabledSections,
}: VisitorTrackerProps) {
  const sectionLastTracked = useRef<Record<string, number>>({});
  const visitorIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let observer: IntersectionObserver | null = null;

    const run = async () => {
      const storedId = localStorage.getItem(STORAGE_KEY_ID);

      try {
        const body: { visitorId?: string } = {};
        if (storedId) body.visitorId = storedId;

        const res = await fetch("/api/visitors/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await res.json();
        if (!res.ok) return;

        const id = data.visitorId ?? storedId;
        if (id) {
          visitorIdRef.current = id;
          localStorage.setItem(STORAGE_KEY_ID, id);
          if (data.visitorName) {
            localStorage.setItem(STORAGE_KEY_NAME, data.visitorName);
          }
        }
      } catch {
        visitorIdRef.current = storedId;
      }

      const vid = visitorIdRef.current ?? localStorage.getItem(STORAGE_KEY_ID);
      if (!vid) return;

      observer = new IntersectionObserver(
        (entries) => {
          const now = Date.now();
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = (entry.target as HTMLElement).id;
            const section = Object.entries(SECTION_IDS).find(
              ([, domId]) => domId === id
            )?.[0];
            if (!section || !enabledSections.includes(section)) return;

            const last = sectionLastTracked.current[section] ?? 0;
            if (now - last < SECTION_DEBOUNCE_MS) return;
            sectionLastTracked.current[section] = now;

            fetch("/api/visitors/track", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ visitorId: vid, section }),
            }).catch(() => {});
          });
        },
        { threshold: 0.3 }
      );

      enabledSections.forEach((section) => {
        const domId = SECTION_IDS[section];
        if (!domId) return;
        const el = document.getElementById(domId);
        if (el) observer?.observe(el);
      });
    };

    run();

    return () => {
      observer?.disconnect();
    };
  }, [enabledSections.join(",")]);

  return null;
}
