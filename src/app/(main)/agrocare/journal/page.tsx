"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WeatherLoginRequired } from "@/components/sections/agrocare/weather/WeatherLoginRequired";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  content: string;
  imageUrl?: string;
}

// Define the expected structure of the API response for journals
interface JournalApiResponse {
  journals: JournalEntry[];
}

export default function JournalPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [latestJournals, setLatestJournals] = useState<JournalEntry[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingJournals, setLoadingJournals] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  // Fetch user data
  useEffect(() => {
    if (!isUnauthorized) {
      const fetchUser = async () => {
        try {
          const res = await fetch("/api/auth/me");

          if (res.status === 401) {
            setIsUnauthorized(true);
            return;
          }

          if (!res.ok) {
            throw new Error(`Failed to fetch user: ${res.status}`);
          }

          const data = await res.json();
          if (data?.user?.name) {
            setUser({ name: data.user.name });
          } else {
            setError("Gagal memuat data user: Nama tidak tersedia.");
          }
        } catch (error: unknown) {
          console.error("Error fetching user data:", error);
          if (!isUnauthorized) {
            setError("Gagal memuat data user.");
          }
        } finally {
          setLoadingUser(false);
        }
      };
      fetchUser();
    }
  }, [isUnauthorized]);

  // Fetch latest 4 journal entries
  useEffect(() => {
    if (!isUnauthorized) {
      const fetchJournals = async () => {
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

          const data: JournalApiResponse = await res.json();
          if (Array.isArray(data?.journals)) {
            setLatestJournals(data.journals);
          } else {
            setError("Format data jurnal tidak valid.");
          }
        } catch (error: unknown) {
          console.error("Error fetching journals:", error);
          if (!isUnauthorized) {
            setError("Gagal memuat daftar journal.");
          }
        } finally {
          setLoadingJournals(false);
        }
      };
      fetchJournals();
    }
  }, [isUnauthorized]);

  // Show unauthorized state first
  if (isUnauthorized) {
    return <WeatherLoginRequired />;
  }

  // Show loading state
  if (loadingUser || loadingJournals) {
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

  // Render authenticated content
  return (
    <div
      className="min-h-screen py-40 flex justify-center"
      style={{
        backgroundImage: `url('/assets/images/journaling/bg-Journaling.png')`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center",
        backgroundSize: "100% auto",
      }}
    >
      <div className=" w-[90%]">
        {/* Greeting Section */}
        <div className="bg-primary-200 flex font-platypi flex-col items-center text-white p-8 rounded-[40px] mb-8 shadow-xl">
          <h1 className="text-4xl font-bold mb-2">
            Hallo, {user?.name || "User"}!
          </h1>
          <p className="text-2xl font-bold opacity-90">
            Bagaimana kabar tanamanmu hari ini?
          </p>
          <p className="text-2xl font-bold opacity-90">
            Yuk, catat pertumbuhannya!
          </p>
        </div>

        {/* Create Journal Button */}
        <div className="text-center mb-8 w-full border-2 border-primary-400 py-10 bg-transparent hover:bg-primary-100 hover:border-primary-100 cursor-pointer rounded-3xl font-platypi">
          <Button
            onClick={() => router.push("/agrocare/journal/create")}
            className="text-3xl bg-transparent hover:bg-transparent text-primary-400 cursor-pointer font-semibold flex items-center justify-center w-full"
          >
            <PlusCircle style={{ width: 30, height: 30 }} className="mr-2" />
            Buat Jurnal
          </Button>
        </div>

        {/* Journal History Section */}
        <div className="w-full bg-primary-100 px-23 py-15 rounded-[40px]">
          <h2 className="text-2xl font-bold mb-4">Riwayat Journal Anda</h2>

          {latestJournals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {latestJournals.map((journal) => (
                <Card key={journal.id}>
                  {journal.imageUrl && (
                    <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                      <Image
                        src={journal.imageUrl}
                        alt={journal.title}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{journal.title}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {format(fromUnixTime(journal.date), "EEEE, d MMMM yyyy", {
                        locale: id,
                      })}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 line-clamp-3">
                      {journal.content}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push(`/agrocare/journal/${journal.id}`)
                      }
                    >
                      {" "}
                      Lihat Journal
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p>Belum ada jurnal yang dibuat.</p>
          )}

          {/* See More Button */}
          {latestJournals.length > 0 && (
            <div className="text-center mt-6">
              <Button
                variant="outline"
                className="hover:bg-primary-200"
                onClick={() =>
                  router.push(`/agrocare/journal/${latestJournals[0].id}`)
                }
              >
                Lihat Selengkapnya
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
