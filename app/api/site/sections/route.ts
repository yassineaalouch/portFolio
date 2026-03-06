import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const DEFAULT_SECTIONS = ["hero", "projects", "skills", "contact", "footer"];
const VALID_SECTIONS = new Set(DEFAULT_SECTIONS);

function sanitize(sections: unknown): string[] {
  if (!Array.isArray(sections)) return DEFAULT_SECTIONS;
  const list = sections
    .filter((s) => typeof s === "string" && VALID_SECTIONS.has(s as string))
    .filter((s, i, a) => a.indexOf(s) === i) as string[];
  return list.length ? list : DEFAULT_SECTIONS;
}

export async function GET() {
  try {
    const db = await getDb();
    const doc = await db.collection("siteConfig").findOne({ key: "sections" });
    const enabledSections =
      doc && Array.isArray(doc.enabledSections)
        ? sanitize(doc.enabledSections)
        : DEFAULT_SECTIONS;
    return NextResponse.json({ enabledSections });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { enabledSections: DEFAULT_SECTIONS },
      { status: 200 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const enabledSections = sanitize(body.enabledSections);
    const db = await getDb();

    await db
      .collection("siteConfig")
      .updateOne(
        { key: "sections" },
        { $set: { enabledSections, updatedAt: new Date() } },
        { upsert: true }
      );

    return NextResponse.json({ success: true, enabledSections });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Failed to save sections" },
      { status: 500 }
    );
  }
}
