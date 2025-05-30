import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth-node";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const journal = await prisma.journal.findUnique({
      where: {
        id: params.id,
      },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
        media: true,
        plant: true,
      },
    });

    if (!journal) {
      return NextResponse.json(
        { error: "Journal entry not found" },
        { status: 404 },
      );
    }

    if (journal.userId !== session.id) {
      return NextResponse.json(
        { error: "Unauthorized access to this journal entry" },
        { status: 403 },
      );
    }

    return NextResponse.json({ journal });
  } catch (error) {
    console.error("Error fetching journal entry:", error);
    return NextResponse.json(
      { error: "Failed to fetch journal entry" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const journal = await prisma.journal.findUnique({
      where: {
        id: params.id,
      },
      include: {
        media: true,
      },
    });

    if (!journal) {
      return NextResponse.json(
        { error: "Journal entry not found" },
        { status: 404 },
      );
    }

    if (journal.userId !== session.id) {
      return NextResponse.json(
        { error: "Unauthorized access to this journal entry" },
        { status: 403 },
      );
    }

    for (const media of journal.media) {
      await cloudinary.uploader.destroy(media.fileKey);
    }

    await prisma.journal.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: "Journal entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting journal entry:", error);
    return NextResponse.json(
      { error: "Failed to delete journal entry" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const journal = await prisma.journal.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!journal) {
      return NextResponse.json(
        { error: "Journal entry not found" },
        { status: 404 },
      );
    }

    if (journal.userId !== session.id) {
      return NextResponse.json(
        { error: "Unauthorized access to this journal entry" },
        { status: 403 },
      );
    }

    const data = await request.json();

    const updatedJournal = await prisma.journal.update({
      where: {
        id: params.id,
      },
      data: {
        title: data.title,
        date: data.date ? new Date(data.date) : undefined,
        plantId: data.plantId,
      },
    });

    return NextResponse.json({
      message: "Journal entry updated successfully",
      journal: updatedJournal,
    });
  } catch (error) {
    console.error("Error updating journal entry:", error);
    return NextResponse.json(
      { error: "Failed to update journal entry" },
      { status: 500 },
    );
  }
}
