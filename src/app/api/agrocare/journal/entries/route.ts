import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSessionFromRequest } from "@/lib/auth-node";

const prisma = new PrismaClient();

// GET - Fetch journal entries
export async function GET(request: NextRequest) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "date";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const journals = await prisma.journal.findMany({
      where: { userId: user.id },
      include: {
        media: true,
        plant: true,
      },
      orderBy: {
        [sortBy]: sortOrder as "asc" | "desc",
      },
      take: limit,
    });

    // Transform data untuk frontend
    const transformedJournals = journals.map((journal) => ({
      id: journal.id,
      title: journal.title || `Journal ${new Date(journal.date).toLocaleDateString("id-ID")}`,
      date: Math.floor(journal.date.getTime() / 1000), // Unix timestamp
      content: [
        journal.kondisiTanaman,
        journal.aktivitasHariIni,
        journal.perubahanTercatat,
        journal.catatanTambahan,
      ]
        .filter(Boolean)
        .join(" "),
      imageUrl: journal.media.find((m) => m.type === "IMAGE")?.url,
      kondisiTanaman: journal.kondisiTanaman,
      aktivitasHariIni: journal.aktivitasHariIni,
      perubahanTercatat: journal.perubahanTercatat,
      catatanTambahan: journal.catatanTambahan,
      media: journal.media,
      plant: journal.plant,
    }));

    return NextResponse.json({ journals: transformedJournals });
  } catch (error) {
    console.error("Error fetching journals:", error);
    return NextResponse.json(
      { error: "Failed to fetch journals" },
      { status: 500 }
    );
  }
}

// POST - Create new journal entry
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const plantId = formData.get("plantId") as string | null;
    const kondisiTanaman = formData.get("kondisiTanaman") as string;
    const aktivitasHariIni = formData.get("aktivitasHariIni") as string;
    const perubahanTercatat = formData.get("perubahanTercatat") as string;
    const catatanTambahan = formData.get("catatanTambahan") as string;
    const mediaFile = formData.get("media") as File | null;

    // Validasi required field
    if (!kondisiTanaman?.trim()) {
      return NextResponse.json(
        { error: "Kondisi tanaman harus diisi" },
        { status: 400 }
      );
    }

    // Create journal entry
    const journal = await prisma.journal.create({
      data: {
        title: title || `Journal ${new Date().toLocaleDateString("id-ID")}`,
        userId: user.id,
        plantId: plantId || null,
        kondisiTanaman: kondisiTanaman.trim(),
        aktivitasHariIni: aktivitasHariIni?.trim() || null,
        perubahanTercatat: perubahanTercatat?.trim() || null,
        catatanTambahan: catatanTambahan?.trim() || null,
      },
    });

    // Handle media upload if exists
    if (mediaFile) {
      // Simpan file (implementasi sesuai storage yang digunakan)
      const fileUrl = `/uploads/journals/${journal.id}_${Date.now()}_${mediaFile.name}`;
      const fileKey = `journal_${journal.id}_${Date.now()}`;
      
      // Simpan media record
      await prisma.media.create({
        data: {
          url: fileUrl,
          fileKey: fileKey,
          type: mediaFile.type.startsWith('image/') ? 'IMAGE' : 'VIDEO',
          journalId: journal.id,
        },
      });
    }

    return NextResponse.json({ 
      message: "Journal berhasil disimpan", 
      journal: { id: journal.id } 
    });
  } catch (error) {
    console.error("Error creating journal:", error);
    return NextResponse.json(
      { error: "Failed to create journal" },
      { status: 500 }
    );
  }
}
