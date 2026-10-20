import { NextRequest, NextResponse } from "next/server";
import { addRecruiterInquiryToDb, getStudentFromDb } from "@/lib/server-db";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await context.params;
    const body = await req.json();
    const { senderName, senderEmail, company, roleOffered, message } = body;

    if (!senderName || !senderEmail || !message) {
      return NextResponse.json(
        { error: "Sender name, email, and message are required" },
        { status: 400 }
      );
    }

    const result = addRecruiterInquiryToDb(username, {
      senderName,
      senderEmail,
      company: company || "Undisclosed Organization",
      roleOffered: roleOffered || "General Inquiry",
      message
    });

    if (!result.success || !result.inquiry) {
      return NextResponse.json({ error: result.error || "Failed to submit inquiry" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      inquiry: result.inquiry,
      message: "Inquiry sent directly to student's verified inbox"
    });
  } catch (err: any) {
    console.error("Submit inquiry error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

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

    return NextResponse.json({
      success: true,
      inquiries: student.inquiries || []
    });
  } catch (err: any) {
    console.error("Get inquiries error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
