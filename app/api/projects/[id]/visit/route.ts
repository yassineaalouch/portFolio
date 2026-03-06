import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const visitorId = typeof body.visitorId === "string" ? body.visitorId : null;

    const db = await getDb();
    const projectOid = new ObjectId(id);

    // Ensure unique index exists (idempotent)
    await db.collection("projectVisitors").createIndex(
      { projectId: 1, visitorId: 1 },
      { unique: true }
    ).catch(() => {});

    // Upsert projectVisitors - only inserts if (projectId, visitorId) is new
    const upsertResult = await db.collection("projectVisitors").updateOne(
      { projectId: projectOid, visitorId: visitorId ?? "anonymous" },
      { $set: { projectId: projectOid, visitorId: visitorId ?? "anonymous", lastVisit: new Date() } },
      { upsert: true }
    );

    const isNewUniqueVisitor = upsertResult.upsertedCount > 0;

    // $inc visits (total), and uniqueVisitors only if new unique visitor
    const updateOp: Record<string, unknown> = { $inc: { visits: 1 } };
    if (isNewUniqueVisitor) {
      updateOp.$inc = { visits: 1, uniqueVisitors: 1 };
    }

    const result = await db.collection("projects").findOneAndUpdate(
      { _id: projectOid },
      updateOp,
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const doc = result as { visits?: number; uniqueVisitors?: number };
    return NextResponse.json({
      visits: doc.visits ?? 1,
      uniqueVisitors: doc.uniqueVisitors ?? (isNewUniqueVisitor ? 1 : 0),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to track visit" },
      { status: 500 }
    );
  }
}
