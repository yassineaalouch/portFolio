import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL as string;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD as string;

export async function POST(req: NextRequest) {
  if (!JWT_SECRET || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return NextResponse.json(
      { message: "Server auth not configured" },
      { status: 500 }
    );
  }

  const { email, password } = await req.json();

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const token = jwt.sign(
    {
      sub: "admin",
      email,
      role: "admin",
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  const res = NextResponse.json({ success: true });
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}

