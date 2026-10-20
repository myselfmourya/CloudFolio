import { NextRequest, NextResponse } from "next/server";
import { updateProjectInDb, deleteProjectFromDb } from "@/lib/server-db";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ username: string; projectId: string }> }
) {
  try {
    const { username, projectId } = await context.params;
    const body = await req.json();

    const result = updateProjectInDb(username, projectId, body);

    if (!result.success || !result.project) {
      return NextResponse.json({ error: result.error || "Failed to update project" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      project: result.project
    });
  } catch (err: any) {
    console.error("Update project error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ username: string; projectId: string }> }
) {
  try {
    const { username, projectId } = await context.params;

    const result = deleteProjectFromDb(username, projectId);

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to delete project" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully"
    });
  } catch (err: any) {
    console.error("Delete project error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
