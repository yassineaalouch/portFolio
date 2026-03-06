"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, Linkedin, Github, Twitter, Facebook } from "lucide-react";

type ContactInfo = {
  email?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  facebook?: string;
};

function buildSocialLinks(info: ContactInfo): { id: string; label: string; href: string }[] {
  const links: { id: string; label: string; href: string }[] = [];
  if (info.email) {
    links.push({ id: "email", label: "Email", href: `mailto:${info.email}` });
  }
  if (info.github) {
    links.push({
      id: "github",
      label: "GitHub",
      href: info.github.startsWith("http") ? info.github : `https://${info.github}`,
    });
  }
  if (info.linkedin) {
    links.push({
      id: "linkedin",
      label: "LinkedIn",
      href: info.linkedin.startsWith("http") ? info.linkedin : `https://${info.linkedin}`,
    });
  }
  if (info.twitter) {
    links.push({
      id: "twitter",
      label: "Twitter",
      href: info.twitter.startsWith("http") ? info.twitter : `https://${info.twitter}`,
    });
  }
  if (info.facebook) {
    links.push({
      id: "facebook",
      label: "Facebook",
      href: info.facebook.startsWith("http") ? info.facebook : `https://${info.facebook}`,
    });
  }
  if (links.length === 0) {
    return [
      { id: "email", label: "Email", href: "mailto:contact@example.com" },
      { id: "github", label: "GitHub", href: "#" },
      { id: "linkedin", label: "LinkedIn", href: "#" },
      { id: "twitter", label: "Twitter", href: "#" },
    ];
  }
  return links;
}

export default function Footer() {
  const [visible, setVisible] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({});
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    fetch("/api/site/contact")
      .then((r) => r.json())
      .then((data) => setContactInfo(data || {}))
      .catch(() => {});
  }, []);

  const socialLinks = buildSocialLinks(contactInfo);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
          }
        });
      },
      { rootMargin: "-120px 0px -80px", threshold: 0.15 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      id="footer"
      ref={sectionRef}
      className={`relative overflow-hidden bg-gradient-to-b from-slate-950 via-black to-slate-950 px-6 py-10 text-slate-300 sm:py-12 md:py-14 ${
        visible ? "footer-section-visible" : "footer-section-hidden"
      }`}
    >
      {/* Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -top-24 left-1/4 h-56 w-56 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-64 w-64 rounded-full bg-purple-600/15 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 0 0, rgba(148,163,184,0.45) 0, transparent 55%),
              linear-gradient(rgba(148,163,184,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(148,163,184,0.15) 1px, transparent 1px)
            `,
            backgroundSize: "auto, 56px 56px, 56px 56px",
          }}
        />
      </div>

      {/* Floating badges */}
      <div className="pointer-events-none absolute inset-0">
        <FooterFloatingBadge
          label="React"
          className="left-[6%] top-[28%]"
        />
        <FooterFloatingBadge
          label="Next.js"
          className="right-[8%] top-[18%]"
          variant="neutral"
        />
        <FooterFloatingBadge
          label="Node.js"
          className="left-[14%] bottom-[20%]"
          variant="green"
        />
        <FooterFloatingBadge
          label="Cloud"
          className="right-[16%] bottom-[22%]"
          variant="indigo"
        />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-6 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:pt-7">
        {/* Left / center: name + tagline */}
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-200 shadow-[0_0_22px_rgba(15,23,42,0.9)] backdrop-blur">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 via-sky-500 to-purple-500 text-[10px] font-bold text-slate-950">
              YA
            </span>
            <span className="uppercase tracking-[0.16em] text-slate-400">
              Yassine Aalouch
            </span>
          </div>
          <p className="text-xs text-slate-400 sm:text-sm">
            Building modern web experiences.
          </p>
        </div>

        {/* Middle: socials */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {socialLinks.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target={item.id === "email" ? "_self" : "_blank"}
              rel={item.id === "email" ? undefined : "noopener noreferrer"}
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-200 shadow-[0_12px_30px_rgba(15,23,42,0.9)] backdrop-blur-md transition-transform duration-150 hover:-translate-y-0.5 hover:border-cyan-400/80 hover:text-cyan-200 sm:text-sm"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[10px] font-semibold text-slate-100 shadow-inner shadow-slate-950 transition-colors duration-150 group-hover:bg-gradient-to-br group-hover:from-cyan-500 group-hover:via-sky-500 group-hover:to-purple-500">
                <FooterIcon id={item.id} />
              </span>
              <span>{item.label}</span>
            </a>
          ))}
        </div>

        {/* Right: legal */}
        <div className="text-center text-[11px] text-slate-500 sm:text-right sm:text-xs">
          © 2026 Yassine Aalouch. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FooterIcon({ id }: { id: string }) {
  const iconClass = "h-3.5 w-3.5";
  switch (id) {
    case "email":
      return <Mail className={iconClass} />;
    case "github":
      return <Github className={iconClass} />;
    case "linkedin":
      return <Linkedin className={iconClass} />;
    case "twitter":
      return <Twitter className={iconClass} />;
    case "facebook":
      return <Facebook className={iconClass} />;
    default:
      return <Mail className={iconClass} />;
  }
}

type FooterFloatingBadgeProps = {
  label: string;
  className?: string;
  variant?: "cyan" | "neutral" | "green" | "indigo";
};

const FOOTER_BADGE_ICON_SLUGS: Record<string, string> = {
  React: "react",
  "Next.js": "nextdotjs",
  "Node.js": "nodedotjs",
  Cloud: "cloudflare",
};

function FooterFloatingBadge({
  label,
  className,
  variant = "cyan",
}: FooterFloatingBadgeProps) {
  const variants: Record<
    NonNullable<FooterFloatingBadgeProps["variant"]>,
    string
  > = {
    cyan: "from-cyan-400/90 to-sky-500/80",
    neutral: "from-slate-100/90 to-slate-300/80 text-slate-900",
    green: "from-emerald-400/90 to-lime-400/80",
    indigo: "from-indigo-400/90 to-violet-500/80",
  };

  const slug = FOOTER_BADGE_ICON_SLUGS[label] ?? null;

  return (
    <div
      className={`footer-floating-badge pointer-events-none absolute hidden items-center gap-2 rounded-full bg-slate-900/70 px-3 py-1.5 text-[11px] font-medium text-slate-100 shadow-[0_15px_45px_rgba(15,23,42,0.9)] ring-1 ring-white/10 backdrop-blur-md md:inline-flex ${className}`}
    >
      <span
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br text-[10px] shadow-[0_0_18px_rgba(148,163,184,0.75)] ${
          variants[variant]
        }`}
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

