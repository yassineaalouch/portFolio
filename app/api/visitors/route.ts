import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();

    const [visitors, viewsDoc, dailyDocs, totalVisitorsCount] = await Promise.all([
      db
        .collection("visitors")
        .find({})
        .sort({ lastVisit: -1 })
        .limit(100)
        .toArray(),
      db.collection("views").findOne({}),
      db
        .collection("dailyVisits")
        .find({})
        .sort({ date: -1 })
        .limit(7)
        .toArray(),
      db.collection("visitors").countDocuments(),
    ]);

    const totalVisits = viewsDoc?.total ?? 0;

    const sectionTotals: Record<string, number> = {
      hero: 0,
      projects: 0,
      skills: 0,
      contact: 0,
      footer: 0,
    };

    visitors.forEach((v: { sectionVisits?: Record<string, number> }) => {
      const sv = v.sectionVisits ?? {};
      Object.keys(sectionTotals).forEach((key) => {
        sectionTotals[key] += sv[key] ?? 0;
      });
    });

    const list = visitors.map(
      (v: {
        visitorId: string;
        visitorName?: string;
        totalVisits: number;
        lastVisit: Date;
        sectionVisits?: Record<string, number>;
      }) => ({
        visitorId: v.visitorId,
        visitorName: v.visitorName ?? "visitor",
        totalVisits: v.totalVisits,
        lastVisit: v.lastVisit,
        sectionVisits: v.sectionVisits ?? {
          hero: 0,
          projects: 0,
          skills: 0,
          contact: 0,
          footer: 0,
        },
      })
    );

    const dailyTrend = dailyDocs
      .reverse()
      .map((d: { date: string; count: number }) => d.count);

    return NextResponse.json({
      visitors: list,
      totalVisits,
      totalVisitors: totalVisitorsCount ?? 0,
      sectionTotals,
      dailyTrend: dailyTrend.length ? dailyTrend : [0, 0, 0, 0, 0, 0, 0],
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Failed to fetch visitors" },
      { status: 500 }
    );
  }
}
