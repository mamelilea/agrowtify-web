"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { WeatherLoginRequired } from "@/components/sections/agrocare/weather/WeatherLoginRequired";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { format, fromUnixTime } from "date-fns";
import { id } from "date-fns/locale";

// Define interfaces for data
interface User {
  name: string;
}

interface JournalEntry {
  id: string;
  date: number; // Unix timestamp
  title: string;
  kondisiTanaman?: string;
  aktivitasHariIni?: string;
  perubahanTercatat?: string;
  catatanTambahan?: string;
  media: Array<{
    id: string;
    url: string;
    type: "IMAGE" | "VIDEO";
  }>;
  plant?: {
    id: string;
    name: string;
  };
}

interface JournalApiResponse {
  journal: JournalEntry;
}

interface JournalsListResponse {
  journals: JournalEntry[];
}

// Add dummy image URLs
const DUMMY_IMAGES = {
  plant: "/assets/images/dummy/plant-placeholder.jpg",
  journal: "/assets/images/dummy/journal-placeholder.jpg",
};

export default function JournalDetailPage() {
  const router = useRouter();
  const params = useParams();
  const journalId = params?.id as string;

  const [currentJournal, setCurrentJournal] = useState<JournalEntry | null>(
    null
  );
  const [otherJournals, setOtherJournals] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [imageError, setImageError] = useState<{ [key: string]: boolean }>({});

  // Fetch current journal details
  useEffect(() => {
    if (!isUnauthorized && journalId) {
      const fetchJournalDetail = async () => {
        try {
          const res = await fetch(`/api/agrocare/journal/entries/${journalId}`);

          if (res.status === 401) {
            setIsUnauthorized(true);
            return;
          }

          if (!res.ok) {
            throw new Error(`Failed to fetch journal: ${res.status}`);
          }

          const data: JournalApiResponse = await res.json();
          if (data?.journal) {
            setCurrentJournal(data.journal);
          } else {
            setError("Journal tidak ditemukan.");
          }
        } catch (err: any) {
          console.error("Error fetching journal detail:", err);
          if (!isUnauthorized) {
            setError("Gagal memuat detail journal.");
          }
        }
      };
      fetchJournalDetail();
    }
  }, [isUnauthorized, journalId]);

  // Fetch other journals for sidebar
  useEffect(() => {
    if (!isUnauthorized) {
      const fetchOtherJournals = async () => {
        try {
          const res = await fetch(
            "/api/agrocare/journal/entries?limit=10&sortBy=date&sortOrder=desc"
          );

          if (res.status === 401) {
            setIsUnauthorized(true);
            return;
          }

          if (!res.ok) {
            throw new Error(`Failed to fetch journals: ${res.status}`);
          }

          const data: JournalsListResponse = await res.json();
          if (Array.isArray(data?.journals)) {
            // Filter out current journal from the list
            const filtered = data.journals.filter((j) => j.id !== journalId);
            setOtherJournals(filtered);
          }
        } catch (err: any) {
          console.error("Error fetching other journals:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchOtherJournals();
    }
  }, [isUnauthorized, journalId]);

  // Show unauthorized state first
  if (isUnauthorized) {
    return <WeatherLoginRequired />;
  }

  // Show loading state
  if (loading || !currentJournal) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  const formatJournalContent = (journal: JournalEntry) => {
    const sections = [];

    if (journal.kondisiTanaman) {
      sections.push(`Kondisi tanaman: ${journal.kondisiTanaman}`);
    }
    if (journal.aktivitasHariIni) {
      sections.push(`Aktivitas hari ini: ${journal.aktivitasHariIni}`);
    }
    if (journal.perubahanTercatat) {
      sections.push(`Perubahan tercatat: ${journal.perubahanTercatat}`);
    }
    if (journal.catatanTambahan) {
      sections.push(`Catatan tambahan: ${journal.catatanTambahan}`);
    }

    return sections.join(" ");
  };

  const getImageUrl = (journal: JournalEntry) => {
    const imageMedia = journal.media.find((m) => m.type === "IMAGE");
    if (!imageMedia) return DUMMY_IMAGES.journal;
    return imageError[imageMedia.id] ? DUMMY_IMAGES.journal : imageMedia.url;
  };

  return (
    <div
      className="min-h-screen flex justify-center w-full"
      style={{
        backgroundImage: `url('/assets/images/journaling/bg-DetailJournal.png')`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center",
        backgroundSize: "100% auto",
      }}
    >
      <div className="flex w-[90%] justify-center">
        {/* Sidebar - Riwayat Journal Lain */}
        <div className="w-80 bg-primary-100 min-h-screen py-30 px-6 text-white flex flex-col">
          <div className="mb-8">
            <Button
              onClick={() => router.push("/agrocare/journal")}
              className="flex items-center gap-2 text-white hover:bg-green-600 bg-transparent border-0 p-0 font-normal"
            >
              <ArrowLeft className="w-5 h-5" />
              Kembali ke Journal
            </Button>
          </div>

          <h2 className="text-xl font-bold mb-6">
            Riwayat Journal Anda yang lain
          </h2>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[100vh] rounded-xl">
            {otherJournals.map((journal) => (
              <div
                key={journal.id}
                className="bg-white rounded-lg p-4 text-black cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => router.push(`/agrocare/journal/${journal.id}`)}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex w-full items-center">
                    <div className="w-1/2">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={getImageUrl(journal)}
                          alt={journal.title}
                          fill
                          className="object-cover"
                          onError={() => {
                            const imageMedia = journal.media.find(
                              (m) => m.type === "IMAGE"
                            );
                            if (imageMedia) {
                              setImageError((prev) => ({
                                ...prev,
                                [imageMedia.id]: true,
                              }));
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-1/2">
                      <p className="font-medium text-lg mb-1">
                        {format(fromUnixTime(journal.date), "EEEE,", {
                          locale: id,
                        })}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-2 line-clamp-2">
                      {journal.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {formatJournalContent(journal).substring(0, 80)}...
                    </p>
                    <Button
                      className="mt-3 bg-primary-200 hover:bg-primary-300 text-white text-sm px-4 py-2 rounded-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/agrocare/journal/${journal.id}`);
                      }}
                    >
                      Lihat Journal
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - Detail Journal */}
        <div className="flex-1 py-30 px-8">
          <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden">
            {/* Header Baru (Gambar di Kiri, Tanggal dan Judul Jurnal di Kanan) */}
            <div className="flex flex-row w-full p-8 rounded-t-2xl">
              <div className="relative h-64 overflow-hidden w-max">
                <div className="bg-black rounded-full h-full w-64">
                  <Image
                    src={getImageUrl(currentJournal)}
                    alt={currentJournal.title}
                    fill
                    onError={() => {
                      const imageMedia = currentJournal.media.find(
                        (m) => m.type === "IMAGE"
                      );
                      if (imageMedia) {
                        setImageError((prev) => ({
                          ...prev,
                          [imageMedia.id]: true,
                        }));
                      }
                    }}
                  />
                </div>
              </div>
              <div className=" p-6 flex flex-col justify-center">
                <p className="text-4xl text-gray-500 mb-2">
                  {format(
                    fromUnixTime(currentJournal.date),
                    "EEEE, d MMMM yyyy",
                    { locale: id }
                  )}
                </p>
                <h1 className="text-5xl font-bold">{currentJournal.title}</h1>
              </div>
            </div>

            {/* Journal Content */}
            <div className="p-8">
              <h2 className="text-xl font-bold mb-6">Deskripsi</h2>

              <div className="space-y-6 text-gray-700 leading-relaxed">
                {currentJournal.kondisiTanaman && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-800">
                      Kondisi Tanaman
                    </h3>
                    <p>{currentJournal.kondisiTanaman}</p>
                  </div>
                )}

                {currentJournal.aktivitasHariIni && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-800">
                      Aktivitas Hari Ini
                    </h3>
                    <p>{currentJournal.aktivitasHariIni}</p>
                  </div>
                )}

                {currentJournal.perubahanTercatat && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-800">
                      Perubahan Tercatat
                    </h3>
                    <p>{currentJournal.perubahanTercatat}</p>
                  </div>
                )}

                {currentJournal.catatanTambahan && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-800">
                      Catatan Tambahan
                    </h3>
                    <p>{currentJournal.catatanTambahan}</p>
                  </div>
                )}

                {/* Additional media */}
                {currentJournal.media.length > 1 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-4 text-gray-800">
                      Media Lainnya
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {currentJournal.media.slice(1).map((media) => (
                        <div
                          key={media.id}
                          className="relative h-32 rounded-lg overflow-hidden"
                        >
                          <Image
                            src={
                              imageError[media.id]
                                ? DUMMY_IMAGES.journal
                                : media.url
                            }
                            alt="Journal media"
                            fill
                            className="object-cover"
                            onError={() =>
                              setImageError((prev) => ({
                                ...prev,
                                [media.id]: true,
                              }))
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end mt-8 pt-6 border-t">
                <Button
                  onClick={() => router.push("/agrocare/journal")}
                  className="bg-primary-200 hover:bg-primary-300 cursor-pointer text-white px-6 py-2 rounded-lg"
                >
                  Kembali
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
