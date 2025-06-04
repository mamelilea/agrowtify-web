import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSessionFromRequest } from "@/lib/auth-node";

const prisma = new PrismaClient();

// GET - Fetch single journal entry
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const journal = await prisma.journal.findFirst({
      where: { 
        id: params.id,
        userId: user.id, // Ensure user can only access their own journals
      },
      include: {
        media: true,
        plant: true,
      },
    });

    if (!journal) {
      return NextResponse.json({ error: "Journal not found" }, { status: 404 });
    }

    const transformedJournal = {
      id: journal.id,
      title: journal.title || `Journal ${new Date(journal.date).toLocaleDateString("id-ID")}`,
      date: Math.floor(journal.date.getTime() / 1000),
      kondisiTanaman: journal.kondisiTanaman,
      aktivitasHariIni: journal.aktivitasHariIni,
      perubahanTercatat: journal.perubahanTercatat,
      catatanTambahan: journal.catatanTambahan,
      media: journal.media,
      plant: journal.plant,
    };

    return NextResponse.json({ journal: transformedJournal });
  } catch (error) {
    console.error("Error fetching journal:", error);
    return NextResponse.json(
      { error: "Failed to fetch journal" },
      { status: 500 }
    );
  }
}
