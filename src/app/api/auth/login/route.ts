import { NextRequest, NextResponse } from "next/server";
import { verifyStudentCredentials, createSessionToken } from "@/lib/server-db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { emailOrUsername, password } = body;

    if (!emailOrUsername || !password) {
      return NextResponse.json(
        { error: "Please enter your username/email and password" },
        { status: 400 }
      );
    }

    const result = verifyStudentCredentials(emailOrUsername, password);

    if (!result.success || !result.profile) {
      return NextResponse.json(
        { error: result.error || "Invalid username or password" },
        { status: 401 }
      );
    }

    const token = createSessionToken(result.profile.username);

    const response = NextResponse.json({
      success: true,
      profile: result.profile
    });

    response.cookies.set("cloudfolio_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/"
    });

    return response;
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
