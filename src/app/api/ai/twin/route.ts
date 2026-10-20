import { NextRequest, NextResponse } from "next/server";
import { getStudentByUsername } from "@/lib/server-db";
import { DEFAULT_STUDENT } from "@/lib/mock-data";
import { askCandidateTwin } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, question, history } = body;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Question parameter is required." },
        { status: 400 }
      );
    }

    let student = null;
    if (username) {
      student = await getStudentByUsername(username);
    }
    if (!student) {
      student = DEFAULT_STUDENT;
    }

    const result = await askCandidateTwin({
      student,
      question: question.trim(),
      history: Array.isArray(history) ? history : []
    });

    return NextResponse.json({
      success: true,
      reply: result.reply,
      citations: result.citations
    });
  } catch (err: unknown) {
    console.error("AI Twin error:", err);
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
