import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  const db = await getDb();
  const projects = await db.collection("projects").find({}).sort({ _id: -1 }).toArray();
  const serialized = projects.map((p: { _id?: { toString: () => string }; [key: string]: unknown }) => ({
    ...p,
    _id: p._id?.toString?.() ?? p._id,
  }));
  return NextResponse.json(serialized);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = await getDb();

  const images = Array.isArray(body.images)
    ? body.images.filter((u: string) => typeof u === "string" && u.trim())
    : body.Screenshots
      ? [String(body.Screenshots).trim()].filter(Boolean)
      : [];
  const defaultImageIndex = Math.min(
    Math.max(0, Number(body.defaultImageIndex) || 0),
    Math.max(0, images.length - 1)
  );

  const doc = {
    title: body.title,
    description: body.description,
    technologies: body.technologies ?? [],
    images,
    defaultImageIndex,
    link: body.link ?? "",
    codeUrl: body.codeUrl ?? "",
    categories: Array.isArray(body.categories) ? body.categories : (body.categories ? String(body.categories).split(",").map((s: string) => s.trim()).filter(Boolean) : []),
    createdAt: new Date(),
  };

  const result = await db.collection("projects").insertOne(doc);
  return NextResponse.json({ _id: result.insertedId, ...doc }, { status: 201 });
}

