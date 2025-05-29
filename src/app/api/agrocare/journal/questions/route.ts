import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth-node";

export const runtime = "nodejs";

// GET - /api/agrocare/journal/questions
export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const questions = await prisma.journalQuestion.findMany({
      orderBy: {
        orderIndex: "asc",
      },
    });

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error fetching journal questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch journal questions" },
      { status: 500 },
    );
  }
}

// POST - /api/agrocare/journal/questions (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 },
      );
    }

    const data = await request.json();

    // Validate required fields
    if (!data.question || data.orderIndex === undefined) {
      return NextResponse.json(
        { error: "Question text and order index are required" },
        { status: 400 },
      );
    }

    const question = await prisma.journalQuestion.create({
      data,
    });

    return NextResponse.json(
      { message: "Journal question created successfully", question },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating journal question:", error);
    return NextResponse.json(
      { error: "Failed to create journal question" },
      { status: 500 },
    );
  }
}
