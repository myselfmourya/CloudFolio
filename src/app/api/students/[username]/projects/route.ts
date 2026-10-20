import { NextRequest, NextResponse } from "next/server";
import { addProjectToStudentInDb } from "@/lib/server-db";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await context.params;
    const body = await req.json();

    if (!body.title) {
      return NextResponse.json({ error: "Project title is required" }, { status: 400 });
    }

    const result = addProjectToStudentInDb(username, body);

    if (!result.success || !result.project) {
      return NextResponse.json({ error: result.error || "Failed to add project" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      project: result.project
    });
  } catch (err: any) {
    console.error("Add project error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
