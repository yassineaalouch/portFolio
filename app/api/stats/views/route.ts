import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  const db = await getDb();
  const doc = await db.collection("views").findOne({});
  return NextResponse.json({ total: doc?.total ?? 0 });
}

export async function POST() {
  const db = await getDb();
  const result = await db.collection("views").findOneAndUpdate(
    {},
    { $inc: { total: 1 } },
    { upsert: true, returnDocument: "after" }
  );

  const total = result && result.value ? result.value.total : 1;
  return NextResponse.json({ total });
}

