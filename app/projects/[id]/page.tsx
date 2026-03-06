import { notFound } from "next/navigation";
import Link from "next/link";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import ProjectDetailClient from "./ProjectDetailClient";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params) {
  const { id } = await params;
  if (!id || !ObjectId.isValid(id)) return { title: "Project" };
  const db = await getDb();
  const doc = await db.collection("projects").findOne({ _id: new ObjectId(id) });
  if (!doc) return { title: "Project" };
  return {
    title: doc.title ?? "Project",
    description: typeof doc.description === "string" ? doc.description.slice(0, 160) : undefined,
  };
}

export default async function ProjectDetailPage({ params }: Params) {
  const { id } = await params;
  if (!id || !ObjectId.isValid(id)) notFound();

  const db = await getDb();
  const doc = await db.collection("projects").findOne({ _id: new ObjectId(id) });
  if (!doc) notFound();

  const images = Array.isArray(doc.images)
    ? doc.images.filter((u: unknown) => typeof u === "string" && (u.startsWith("http") || u.startsWith("/")))
    : doc.Screenshots
      ? [String(doc.Screenshots).trim()].filter(Boolean)
      : [];
  const defaultImageIndex = Math.min(
    doc.defaultImageIndex ?? 0,
    Math.max(0, images.length - 1)
  );

  const project = {
    id: doc._id.toString(),
    title: doc.title ?? "",
    description: doc.description ?? "",
    technologies: doc.technologies ?? [],
    categories: doc.categories ?? [],
    link: doc.link ?? "",
    codeUrl: doc.codeUrl ?? "",
    images,
    defaultImageIndex,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900 text-slate-100">
      <ProjectDetailClient project={project} />
    </div>
  );
}
