import { NextRequest, NextResponse } from "next/server";
import { recordResumeDownloadInDb, getStudentFromDb } from "@/lib/server-db";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await context.params;
    const student = getStudentFromDb(username);

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    recordResumeDownloadInDb(username);

    return NextResponse.json({
      success: true,
      message: "Resume download recorded",
      downloads: (student.stats?.resumeDownloads || 0) + 1
    });
  } catch (err: any) {
    console.error("Resume download tracking error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
