import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const DEFAULT_CATEGORIES = {
  frontend: {
    title: "Frontend Development",
    description: "Building fast, accessible, and delightful user interfaces.",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML5", "CSS3"],
  },
  backend: {
    title: "Backend Development",
    description: "Designing robust APIs and services that scale.",
    skills: ["Node.js", "Express", "Python", "REST APIs", "GraphQL"],
  },
  database: {
    title: "Database",
    description: "Modeling data for reliability, performance, and simplicity.",
    skills: ["MongoDB", "PostgreSQL", "Redis"],
  },
  cloudDevops: {
    title: "Cloud & DevOps",
    description: "Automating deployment and infrastructure for modern teams.",
    skills: ["Docker", "AWS", "Cloudflare", "CI/CD", "Linux"],
  },
};

function parseSkills(val: unknown): string[] {
  if (Array.isArray(val)) return val.filter((s) => typeof s === "string" && s.trim());
  if (typeof val === "string") return val.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

export async function GET() {
  const db = await getDb();
  const doc = await db.collection("skills").findOne({});
  if (!doc) return NextResponse.json({ categories: DEFAULT_CATEGORIES });

  const categories = doc.categories ?? {};
  const result: Record<string, { title: string; description: string; skills: string[] }> = {};
  for (const key of ["frontend", "backend", "database", "cloudDevops"] as const) {
    const c = categories[key];
    result[key] = {
      title: (c?.title ?? DEFAULT_CATEGORIES[key].title) as string,
      description: (c?.description ?? DEFAULT_CATEGORIES[key].description) as string,
      skills: parseSkills(c?.skills ?? DEFAULT_CATEGORIES[key].skills),
    };
  }
  return NextResponse.json({ categories: result });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const db = await getDb();

  const categories: Record<string, { title: string; description: string; skills: string[] }> = {};
  for (const key of ["frontend", "backend", "database", "cloudDevops"] as const) {
    const c = body.categories?.[key] ?? body[key];
    categories[key] = {
      title: typeof c?.title === "string" ? c.title : DEFAULT_CATEGORIES[key].title,
      description: typeof c?.description === "string" ? c.description : DEFAULT_CATEGORIES[key].description,
      skills: parseSkills(c?.skills ?? []),
    };
  }

  await db.collection("skills").updateOne(
    {},
    { $set: { categories, updatedAt: new Date() } },
    { upsert: true }
  );

  return NextResponse.json({ success: true });
}

