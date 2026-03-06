import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const VALID_SECTIONS = new Set([
  "hero",
  "projects",
  "skills",
  "contact",
  "footer",
]);

function generateVisitorId(): string {
  return `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function generateVisitorName(): string {
  return `visitor-${Math.random().toString(36).slice(2, 6)}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const visitorId = typeof body.visitorId === "string" ? body.visitorId : null;
    const section =
      typeof body.section === "string" && VALID_SECTIONS.has(body.section)
        ? body.section
        : null;

    const db = await getDb();
    const now = new Date();

    if (!visitorId) {
      const newId = generateVisitorId();
      const newName = generateVisitorName();

      const visitor = {
        visitorId: newId,
        visitorName: newName,
        totalVisits: 1,
        lastVisit: now,
        sectionVisits: {
          hero: 0,
          projects: 0,
          skills: 0,
          contact: 0,
          footer: 0,
        },
        createdAt: now,
      };

      if (section) {
        (visitor.sectionVisits as Record<string, number>)[section] = 1;
      }

      await db.collection("visitors").insertOne(visitor);

      await db.collection("views").updateOne(
        {},
        { $inc: { total: 1 } },
        { upsert: true }
      );

      const today = now.toISOString().slice(0, 10);
      await db.collection("dailyVisits").updateOne(
        { date: today },
        { $inc: { count: 1 } },
        { upsert: true }
      );

      return NextResponse.json({
        visitorId: newId,
        visitorName: newName,
      });
    }

    const update: Record<string, unknown> = {
      $inc: { totalVisits: 1 },
      $set: { lastVisit: now },
    };

    if (section) {
      (update.$inc as Record<string, number>) = {
        ...((update.$inc as Record<string, number>) || {}),
        [`sectionVisits.${section}`]: 1,
      };
    }

    await db.collection("visitors").updateOne(
      { visitorId },
      update,
      { upsert: false }
    );

    await db.collection("views").updateOne(
      {},
      { $inc: { total: 1 } },
      { upsert: true }
    );

    const today = now.toISOString().slice(0, 10);
    await db.collection("dailyVisits").updateOne(
      { date: today },
      { $inc: { count: 1 } },
      { upsert: true }
    );

    const visitor = await db.collection("visitors").findOne({ visitorId });
    return NextResponse.json({
      visitorId,
      visitorName: visitor?.visitorName ?? "visitor",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Failed to track visitor" },
      { status: 500 }
    );
  }
}
