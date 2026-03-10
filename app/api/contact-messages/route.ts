import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

type MessageDoc = {
  _id?: unknown;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
  read?: boolean;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (
      !body ||
      typeof body.name !== "string" ||
      typeof body.email !== "string" ||
      typeof body.subject !== "string" ||
      typeof body.message !== "string"
    ) {
      return NextResponse.json(
        { message: "Invalid payload" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const doc: MessageDoc = {
      name: body.name.trim(),
      email: body.email.trim(),
      subject: body.subject.trim(),
      message: body.message.trim(),
      createdAt: new Date(),
      read: false,
    };

    await db.collection<MessageDoc>("contactMessages").insertOne(doc);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Failed to save message" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await getDb();
    const messages = await db
      .collection<MessageDoc>("contactMessages")
      .find({})
      .sort({ createdAt: -1 })
      .limit(200)
      .toArray();

    const serialized = messages.map((m) => ({
      id: String((m as any)._id ?? ""),
      name: m.name,
      email: m.email,
      subject: m.subject,
      message: m.message,
      createdAt: m.createdAt,
      read: !!m.read,
    }));

    return NextResponse.json({ messages: serialized });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Failed to load contact messages" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const id = body?.id;
    if (!id || typeof id !== "string" || !ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const db = await getDb();
    await db
      .collection<MessageDoc>("contactMessages")
      .updateOne({ _id: new ObjectId(id) }, { $set: { read: true } });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Failed to update message" },
      { status: 500 }
    );
  }
}

