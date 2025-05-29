import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth-node";
export const runtime = "nodejs";

// GET - /api/agroguide/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const content = await prisma.agroguideContent.findUnique({
      where: { id: params.id },
      include: { category: true },
    });

    if (!content) {
      return NextResponse.json(
        { error: "Agroguide content not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error("Error fetching agroguide content:", error);
    return NextResponse.json(
      { error: "Failed to fetch agroguide content" },
      { status: 500 },
    );
  }
}

// PUT - /api/agroguide/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
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

    const existingContent = await prisma.agroguideContent.findUnique({
      where: { id: params.id },
    });

    if (!existingContent) {
      return NextResponse.json(
        { error: "Agroguide content not found" },
        { status: 404 },
      );
    }

    const updatedContent = await prisma.agroguideContent.update({
      where: { id: params.id },
      data,
      include: { category: true },
    });

    return NextResponse.json({
      message: "Agroguide content updated successfully",
      content: updatedContent,
    });
  } catch (error) {
    console.error("Error updating agroguide content:", error);
    return NextResponse.json(
      { error: "Failed to update agroguide content" },
      { status: 500 },
    );
  }
}

// DELETE - /api/agroguide/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
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

    const existingContent = await prisma.agroguideContent.findUnique({
      where: { id: params.id },
    });

    if (!existingContent) {
      return NextResponse.json(
        { error: "Agroguide content not found" },
        { status: 404 },
      );
    }

    await prisma.agroguideContent.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "Agroguide content deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting agroguide content:", error);
    return NextResponse.json(
      { error: "Failed to delete agroguide content" },
      { status: 500 },
    );
  }
}
