import { NextRequest, NextResponse } from "next/server";
import { getStudentFromDb } from "@/lib/server-db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const handle = (body.handle || "").toLowerCase().trim().replace(/[^a-z0-9_-]/g, "");

    if (!handle || handle.length < 3) {
      return NextResponse.json(
        { available: false, error: "Handle must be at least 3 characters" },
        { status: 400 }
      );
    }

    const existing = getStudentFromDb(handle);
    const available = !existing;

    return NextResponse.json({
      available,
      handle,
      message: available ? "Handle is available!" : "Handle is already claimed"
    });
  } catch (err: any) {
    console.error("Claim handle error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
