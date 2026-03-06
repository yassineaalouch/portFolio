import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const db = await getDb();
  const doc = await db.collection("projects").findOne({ _id: new ObjectId(id) });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const images = Array.isArray(doc.images)
    ? doc.images
    : doc.Screenshots
      ? [doc.Screenshots].filter(Boolean)
      : [];
  const defaultImageIndex = Math.min(
    doc.defaultImageIndex ?? 0,
    Math.max(0, images.length - 1)
  );
  return NextResponse.json({
    ...doc,
    _id: doc._id.toString(),
    images,
    defaultImageIndex,
  });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
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

  await db.collection("projects").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        title: body.title,
        description: body.description,
        technologies: body.technologies ?? [],
        images,
        defaultImageIndex,
        link: body.link ?? "",
        codeUrl: body.codeUrl ?? "",
        categories: Array.isArray(body.categories) ? body.categories : (body.categories ? String(body.categories).split(",").map((s: string) => s.trim()).filter(Boolean) : []),
        updatedAt: new Date(),
      },
    }
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const db = await getDb();
  await db.collection("projects").deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ success: true });
}

