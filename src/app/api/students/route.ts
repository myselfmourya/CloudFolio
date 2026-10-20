import { NextRequest, NextResponse } from "next/server";
import { listStudentsFromDb } from "@/lib/server-db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || undefined;
    const category = searchParams.get("category") || undefined;

    const students = listStudentsFromDb({ query, category });
    return NextResponse.json({
      success: true,
      count: students.length,
      students
    });
  } catch (err: any) {
    console.error("List students error:", err);
    return NextResponse.json({ error: "Failed to list students" }, { status: 500 });
  }
}
