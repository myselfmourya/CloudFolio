import { NextRequest, NextResponse } from "next/server";
import { auditArchitectureAndCode } from "@/lib/gemini";
import { Project } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { project } = body as { project: Project };

    if (!project || !project.title) {
      return NextResponse.json(
        { error: "Valid project payload is required." },
        { status: 400 }
      );
    }

    const audit = await auditArchitectureAndCode({ project });

    return NextResponse.json({
      success: true,
      audit
    });
  } catch (err: unknown) {
    console.error("AI Audit error:", err);
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
