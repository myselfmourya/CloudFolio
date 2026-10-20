import { NextRequest, NextResponse } from "next/server";
import { 
  getStudentFromDb, 
  updateStudentProfileInDb, 
  recordProfileViewInDb 
} from "@/lib/server-db";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await context.params;
    const student = getStudentFromDb(username);

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Increment profile views on server
    recordProfileViewInDb(username);

    return NextResponse.json({
      success: true,
      student
    });
  } catch (err: any) {
    console.error("Get student error:", err);
    return NextResponse.json({ error: "Failed to retrieve student" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await context.params;
    const body = await req.json();

    const result = updateStudentProfileInDb(username, body);

    if (!result.success || !result.profile) {
      return NextResponse.json({ error: result.error || "Failed to update profile" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      student: result.profile
    });
  } catch (err: any) {
    console.error("Update student error:", err);
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
  }
}
