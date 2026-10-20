import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, getStudentFromDb } from "@/lib/server-db";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("cloudfolio_token")?.value;
    if (!token) {
      // Default to Alex Chen for easy exploration if no session is set
      const defaultStudent = getStudentFromDb("alexchen");
      return NextResponse.json({
        authenticated: false,
        profile: defaultStudent
      });
    }

    const user = getSessionUser(token);
    if (!user) {
      const defaultStudent = getStudentFromDb("alexchen");
      return NextResponse.json({
        authenticated: false,
        profile: defaultStudent
      });
    }

    return NextResponse.json({
      authenticated: true,
      profile: user
    });
  } catch (err: any) {
    console.error("Auth me error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
