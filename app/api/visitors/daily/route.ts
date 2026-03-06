import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

function getDateRange(range: string): { days: number; labels: string[] } {
  const n =
    range === "30"
      ? 30
      : range === "90"
      ? 90
      : 7;
  const labels: string[] = [];
  const now = new Date();

  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    labels.push(d.toISOString().slice(0, 10));
  }

  return { days: n, labels };
}

function formatLabel(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export async function GET(req: NextRequest) {
  try {
    const range = req.nextUrl.searchParams.get("range") ?? "7";
    const { labels: dateLabels } = getDateRange(range);

    const db = await getDb();
    const docs = await db
      .collection("dailyVisits")
      .find({ date: { $in: dateLabels } })
      .toArray();

    const countByDate: Record<string, number> = {};
    dateLabels.forEach((d) => {
      countByDate[d] = 0;
    });
    docs.forEach((d: { date: string | Date; count: number }) => {
      const key =
        typeof d.date === "string"
          ? d.date
          : d.date instanceof Date
          ? d.date.toISOString().slice(0, 10)
          : String(d.date).slice(0, 10);
      if (key in countByDate) {
        countByDate[key] = d.count ?? 0;
      }
    });

    const values = dateLabels.map((d) => countByDate[d] ?? 0);
    const labels = dateLabels.map(formatLabel);

    return NextResponse.json({ labels, values });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Failed to fetch daily visits" },
      { status: 500 }
    );
  }
}
