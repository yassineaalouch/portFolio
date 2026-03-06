import { getDb } from "./mongodb";

const DEFAULT_SECTIONS = ["hero", "projects", "skills", "contact", "footer"];

export async function getEnabledSections(): Promise<string[]> {
  try {
    const db = await getDb();
    const doc = await db.collection("siteConfig").findOne({ key: "sections" });
    if (!doc || !Array.isArray(doc.enabledSections)) return DEFAULT_SECTIONS;
    const valid = new Set(DEFAULT_SECTIONS);
    const list = (doc.enabledSections as string[]).filter((s) => valid.has(s));
    return list.length ? list : DEFAULT_SECTIONS;
  } catch {
    return DEFAULT_SECTIONS;
  }
}
