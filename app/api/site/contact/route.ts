import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  const db = await getDb();
  const doc = await db.collection("contactInfo").findOne({});
  return NextResponse.json(doc || {});
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const db = await getDb();

  const payload = {
    email: body.email ?? "",
    phone: body.phone ?? "",
    facebook: body.facebook ?? "",
    linkedin: body.linkedin ?? "",
    github: body.github ?? "",
    twitter: body.twitter ?? "",
    location: body.location ?? "",
    updatedAt: new Date(),
  };

  await db
    .collection("contactInfo")
    .updateOne({}, { $set: payload }, { upsert: true });

  return NextResponse.json({ success: true });
}

