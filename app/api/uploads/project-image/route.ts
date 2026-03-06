export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client } from "@/lib/r2";

const bucketName = process.env.R2_BUCKET_NAME;
const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL;

export async function POST(req: NextRequest) {
  if (!bucketName || !publicBaseUrl) {
    return NextResponse.json(
      { message: "R2 not configured (bucket or public base URL missing)" },
      { status: 500 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ message: "No file provided" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const ext = (file as File).name.split(".").pop() || "png";
  const key = `projects/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: (file as File).type || "image/*",
      ACL: "public-read",
    })
  );

  const url = `${publicBaseUrl.replace(/\/$/, "")}/${key}`;

  return NextResponse.json({ url });
}

