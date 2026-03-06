"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import { Mail, Phone, MapPin, Linkedin, Github, Globe2 } from "lucide-react";

type ContactItem = {
  id: string;
  label: string;
  href: string;
  sublabel: string;
};

type ContactInfo = {
  email?: string;
  linkedin?: string;
  github?: string;
  location?: string;
  phone?: string;
};

function buildContactItems(info: ContactInfo): ContactItem[] {
  const items: ContactItem[] = [];
  if (info.email) {
    items.push({
      id: "email",
      label: "Email",
      href: `mailto:${info.email}`,
      sublabel: info.email,
    });
  }
  if (info.phone) {
    const telHref = `tel:${info.phone.replace(/\s/g, "")}`;
    items.push({
      id: "phone",
      label: "Téléphone",
      href: telHref,
      sublabel: info.phone,
    });
  }
  if (info.linkedin) {
    items.push({
      id: "linkedin",
      label: "LinkedIn",
      href: info.linkedin.startsWith("http") ? info.linkedin : `https://${info.linkedin}`,
      sublabel: info.linkedin.replace(/^https?:\/\//, ""),
    });
  }
  if (info.github) {
    items.push({
      id: "github",
      label: "GitHub",
      href: info.github.startsWith("http") ? info.github : `https://${info.github}`,
      sublabel: info.github.replace(/^https?:\/\//, ""),
    });
  }
  if (info.location) {
    items.push({
      id: "location",
      label: "Location",
      href: "#",
      sublabel: info.location,
    });
  }
  if (items.length === 0) {
    items.push(
      { id: "email", label: "Email", href: "mailto:contact@example.com", sublabel: "contact@example.com" },
      { id: "linkedin", label: "LinkedIn", href: "#", sublabel: "—" },
      { id: "github", label: "GitHub", href: "#", sublabel: "—" },
      { id: "location", label: "Location", href: "#", sublabel: "Based remotely" }
    );
  }
  return items;
}

function ContactItemIcon({ id }: { id: string }) {
  const iconClass = "h-5 w-5";
  switch (id) {
    case "email":
      return <Mail className={iconClass} />;
    case "phone":
      return <Phone className={iconClass} />;
    case "linkedin":
      return <Linkedin className={iconClass} />;
    case "github":
      return <Github className={iconClass} />;
    case "location":
      return <MapPin className={iconClass} />;
    default:
      return <Mail className={iconClass} />;
  }
}

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialFormState: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [visible, setVisible] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({});

  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    fetch("/api/site/contact")
      .then((r) => r.json())
      .then((data) => setContactInfo(data || {}))
      .catch(() => {});
  }, []);

  const contactItems = buildContactItems(contactInfo);

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
      { rootMargin: "-120px 0px -120px", threshold: 0.15 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const handleChange = (
    field: keyof FormState,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setForm(initialFormState);
      const timeout = setTimeout(() => {
        setIsSuccess(false);
        clearTimeout(timeout);
      }, 2600);
    }, 900);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className={`relative overflow-hidden bg-gradient-to-b from-black via-slate-950 to-slate-900 px-6 py-20 text-slate-100 sm:py-24 md:py-28 ${
        visible ? "contact-section-visible" : "contact-section-hidden"
      }`}
    >
      {/* Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -top-24 left-1/3 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-purple-700/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 0 0, rgba(148,163,184,0.5) 0, transparent 55%),
              linear-gradient(rgba(148,163,184,0.25) 1px, transparent 1px),
              linear-gradient(90deg, rgba(148,163,184,0.25) 1px, transparent 1px)
            `,
            backgroundSize: "auto, 60px 60px, 60px 60px",
          }}
        />
      </div>

      {/* Floating tech icons */}
      <div className="pointer-events-none absolute inset-0">
        <ContactFloatingBadge
          label="Email"
          className="left-[8%] top-[26%]"
          variant="cyan"
        />
        <ContactFloatingBadge
          label="LinkedIn"
          className="right-[10%] top-[18%]"
          variant="indigo"
        />
        <ContactFloatingBadge
          label="GitHub"
          className="left-[12%] bottom-[22%]"
          variant="neutral"
        />
        <ContactFloatingBadge
          label="Remote"
          className="right-[14%] bottom-[18%]"
          variant="green"
        />
      </div>

      <div className="relative mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10 text-center sm:mb-14">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Get In Touch
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400 sm:text-lg">
            I&apos;m always open to discussing new projects, creative ideas, or
            opportunities to build something great.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)]">
          {/* Left: contact items */}
          <div className="space-y-4">
            {contactItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                target={item.id === "location" || item.id === "phone" ? "_self" : "_blank"}
                rel={item.id === "location" || item.id === "phone" ? undefined : "noreferrer"}
                className="contact-card group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 p-4 shadow-md backdrop-blur-md transition-all duration-200 hover:border-cyan-400/70 hover:shadow-[0_0_35px_rgba(34,211,238,0.4)]"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-sky-500/15 to-transparent" />
                </div>

                <div className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-slate-100 shadow-[0_0_18px_rgba(15,23,42,0.9)] ring-1 ring-white/10 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:scale-[1.05] group-hover:bg-gradient-to-br group-hover:from-cyan-500/60 group-hover:via-sky-500/50 group-hover:to-purple-500/60 group-hover:ring-cyan-400/80">
                  <ContactItemIcon id={item.id} />
                </div>

                <div className="relative flex-1">
                  <p className="text-sm font-medium text-slate-100 sm:text-base">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                    {item.sublabel}
                  </p>
                </div>

                <div className="relative hidden text-xs font-medium text-cyan-300 sm:block">
                  <span className="inline-flex items-center gap-1">
                    <span>Open</span>
                    <span className="h-[1px] w-6 bg-gradient-to-r from-cyan-400/70 to-transparent" />
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* Right: form */}
          <div className="relative">
            <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-cyan-500/40 via-sky-500/20 to-purple-500/40 opacity-60 blur-2xl" />
            <div className="relative rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-[0_28px_80px_rgba(15,23,42,0.95)] backdrop-blur-2xl sm:p-6 md:p-7">
              <form
                onSubmit={handleSubmit}
                className="space-y-4 sm:space-y-5"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <FloatingInput
                    id="name"
                    label="Name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={(value) => handleChange("name", value)}
                  />
                  <FloatingInput
                    id="email"
                    label="Email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(value) => handleChange("email", value)}
                  />
                </div>

                <FloatingInput
                  id="subject"
                  label="Subject"
                  type="text"
                  autoComplete="off"
                  value={form.subject}
                  onChange={(value) => handleChange("subject", value)}
                />

                <FloatingTextarea
                  id="message"
                  label="Message"
                  rows={5}
                  value={form.message}
                  onChange={(value) => handleChange("message", value)}
                />

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between sm:pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-sm font-medium text-slate-50 shadow-[0_0_30px_rgba(56,189,248,0.5)] transition hover:shadow-[0_0_40px_rgba(56,189,248,0.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>

                  <p className="text-xs text-slate-400 sm:text-sm">
                    Or reach out directly via{" "}
                    <a
                      href={contactInfo.email ? `mailto:${contactInfo.email}` : "#"}
                      className="text-cyan-300 underline-offset-2 hover:underline"
                    >
                      email
                    </a>
                    .
                  </p>
                </div>

                {isSuccess && (
                  <div className="contact-success mt-2 flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 ring-1 ring-emerald-400/40 sm:text-sm">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 text-[10px] text-emerald-950">
                      ✓
                    </span>
                    <span>Message sent successfully. I&apos;ll get back to you soon.</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type FloatingInputProps = {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
};

function FloatingInput({
  id,
  label,
  type = "text",
  autoComplete,
  value,
  onChange,
}: FloatingInputProps) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="peer block w-full rounded-2xl border border-slate-700/70 bg-slate-900/60 px-3.5 pt-3.5 pb-1.5 text-sm text-slate-100 shadow-inner shadow-slate-950 outline-none transition focus:border-cyan-400 focus:bg-slate-900/80 focus:ring-1 focus:ring-cyan-400/70 sm:text-sm"
        placeholder=" "
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-3.5 top-3 origin-left -translate-y-0 transform text-xs text-slate-400 transition-all duration-150 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-[13px] peer-placeholder-shown:text-slate-500 peer-focus:-translate-y-3.5 peer-focus:text-[11px] peer-focus:text-cyan-300"
      >
        {label}
      </label>
    </div>
  );
}

type FloatingTextareaProps = {
  id: string;
  label: string;
  rows?: number;
  value: string;
  onChange: (value: string) => void;
};

function FloatingTextarea({
  id,
  label,
  rows = 4,
  value,
  onChange,
}: FloatingTextareaProps) {
  return (
    <div className="relative">
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="peer block w-full resize-none rounded-2xl border border-slate-700/70 bg-slate-900/60 px-3.5 pt-3.5 pb-2 text-sm text-slate-100 shadow-inner shadow-slate-950 outline-none transition focus:border-cyan-400 focus:bg-slate-900/80 focus:ring-1 focus:ring-cyan-400/70 sm:text-sm"
        placeholder=" "
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-3.5 top-3 origin-left -translate-y-0 transform text-xs text-slate-400 transition-all duration-150 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-[13px] peer-placeholder-shown:text-slate-500 peer-focus:-translate-y-3.5 peer-focus:text-[11px] peer-focus:text-cyan-300"
      >
        {label}
      </label>
    </div>
  );
}

type ContactFloatingBadgeProps = {
  label: string;
  className?: string;
  variant?: "cyan" | "indigo" | "neutral" | "green";
};

function FloatingContactIcon({ label }: { label: string }) {
  const iconClass = "h-3.5 w-3.5";
  if (label === "Email") return <Mail className={iconClass} />;
  if (label === "LinkedIn") return <Linkedin className={iconClass} />;
  if (label === "GitHub") return <Github className={iconClass} />;
  if (label === "Remote") return <Globe2 className={iconClass} />;
  return <Mail className={iconClass} />;
}

function ContactFloatingBadge({
  label,
  className,
  variant = "cyan",
}: ContactFloatingBadgeProps) {
  const variants: Record<
    NonNullable<ContactFloatingBadgeProps["variant"]>,
    string
  > = {
    cyan: "from-cyan-400/85 to-sky-500/75",
    indigo: "from-indigo-400/90 to-violet-500/75",
    neutral: "from-slate-100/90 to-slate-300/80 text-slate-900",
    green: "from-emerald-400/90 to-lime-400/80",
  };

  return (
    <div
      className={`contact-floating-badge pointer-events-none absolute hidden items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1.5 text-[11px] font-medium text-slate-100 shadow-[0_15px_45px_rgba(15,23,42,0.9)] ring-1 ring-white/10 backdrop-blur-md md:inline-flex ${className}`}
    >
      <span
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br text-[10px] shadow-[0_0_18px_rgba(148,163,184,0.75)] ${
          variants[variant]
        }`}
      >
        <FloatingContactIcon label={label} />
      </span>
      <span>{label}</span>
    </div>
  );
}

