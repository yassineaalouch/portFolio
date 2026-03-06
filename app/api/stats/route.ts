import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();
    const [viewsDoc, totalVisitors] = await Promise.all([
      db.collection("views").findOne({}),
      db.collection("visitors").countDocuments(),
    ]);
    return NextResponse.json({
      totalVisits: viewsDoc?.total ?? 0,
      totalVisitors: totalVisitors ?? 0,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { totalVisits: 0, totalVisitors: 0 },
      { status: 500 }
    );
  }
}
