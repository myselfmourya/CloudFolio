import { NextRequest, NextResponse } from "next/server";
import { getStudentByUsername } from "@/lib/server-db";
import { DEFAULT_STUDENT } from "@/lib/mock-data";
import { generateTargetedPitch } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, targetRole, targetCompany } = body;

    let student = null;
    if (username) {
      student = await getStudentByUsername(username);
    }
    if (!student) {
      student = DEFAULT_STUDENT;
    }

    const pitchData = await generateTargetedPitch({
      student,
      targetRole: targetRole || "Systems Software Engineer",
      targetCompany: targetCompany || "Tech Recruiter"
    });

    return NextResponse.json({
      success: true,
      ...pitchData
    });
  } catch (err: unknown) {
    console.error("AI Pitch error:", err);
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
