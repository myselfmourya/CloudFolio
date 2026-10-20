import { NextRequest, NextResponse } from "next/server";
import { createStudentAccount, createSessionToken } from "@/lib/server-db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, fullName, email, password, university } = body;

    if (!username || !fullName || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields (username, full name, email, password)" },
        { status: 400 }
      );
    }

    const result = createStudentAccount({
      username,
      fullName,
      email,
      password,
      university
    });

    if (!result.success || !result.profile) {
      return NextResponse.json({ error: result.error || "Failed to create account" }, { status: 400 });
    }

    const token = createSessionToken(result.profile.username);

    const response = NextResponse.json({
      success: true,
      profile: result.profile
    });

    // Set secure cookie
    response.cookies.set("cloudfolio_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/"
    });

    return response;
  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
