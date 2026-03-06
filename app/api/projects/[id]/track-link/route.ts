import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

type Params = { params: Promise<{ id: string }> };

const VALID_TYPES = new Set(["demo", "code"]);

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const type = typeof body.type === "string" && VALID_TYPES.has(body.type) ? body.type : null;
    const visitorId = typeof body.visitorId === "string" ? body.visitorId : null;

    if (!type) {
      return NextResponse.json({ error: "Invalid type (demo or code)" }, { status: 400 });
    }

    const db = await getDb();
    const projectOid = new ObjectId(id);

    const collName = type === "demo" ? "projectDemoVisitors" : "projectCodeVisitors";
    const visitsField = type === "demo" ? "demoVisits" : "codeVisits";
    const uniqueField = type === "demo" ? "demoUniqueVisitors" : "codeUniqueVisitors";

    await db.collection(collName).createIndex(
      { projectId: 1, visitorId: 1 },
      { unique: true }
    ).catch(() => {});

    const upsertResult = await db.collection(collName).updateOne(
      { projectId: projectOid, visitorId: visitorId ?? "anonymous" },
      { $set: { projectId: projectOid, visitorId: visitorId ?? "anonymous", lastClick: new Date() } },
      { upsert: true }
    );

    const isNewUnique = upsertResult.upsertedCount > 0;

    const updateOp: Record<string, unknown> = { $inc: { [visitsField]: 1 } };
    if (isNewUnique) {
      (updateOp.$inc as Record<string, number>)[uniqueField] = 1;
    }

    await db.collection("projects").updateOne(
      { _id: projectOid },
      updateOp
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to track click" },
      { status: 500 }
    );
  }
}
