import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AgrowventPreviewSection() {
  const [events, setEvents] = useState<Event[]>([]);
  // Removed unused state variables:
  // const [currentEventIndex, setCurrentEventIndex] = useState(0);
  // These might be needed later for event carousel/slider functionality
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/events?limit=5");
      if (!res.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await res.json();
      if (data.events && data.events.length > 0) {
        setEvents(data.events);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Terjadi kesalahan saat memuat event. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const PlaceholderCard = () => (
    <div className="bg-primary-400 rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row animate-pulse h-[450px] md:h-[400px]">
      {" "}
      <div className="w-full md:w-1/2 bg-gray-700 h-64 md:h-full"></div>
      <div className="w-full md:w-1/2 p-8 flex flex-col justify-center space-y-4">
        <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>{" "}
        <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>{" "}
        <div className="h-4 bg-gray-700 rounded w-5/6 mb-4"></div>{" "}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-700 rounded-full"></div>{" "}
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-700 rounded-full"></div>{" "}
            <div className="h-4 bg-gray-700 rounded w-1/3"></div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-700 rounded-full"></div>{" "}
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="bg-white w-full h-full min-h-screen py-20">
        <div className="w-[80%] mx-auto space-y-20">
          <div className="flex justify-between items-center">
            <h2 className="text-5xl font-platypi font-extrabold text-primary-500">
              Ikuti event menarik di AgrowVent!
            </h2>
          </div>
          <div className="flex justify-center">
            <div className="bg-primary-400 rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row w-full max-w-4xl h-[450px] md:h-[400px]">
              <div className="w-full md:w-1/2 bg-gray-700 flex items-center justify-center">
                <svg
                  className="w-32 h-32 text-white/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="w-full md:w-1/2 p-8 flex flex-col justify-center text-white">
                <h3 className="text-4xl font-semibold mb-4">
                  Oops! Terjadi Gangguan Teknis
                </h3>
                <p className="text-white/80 mb-6">
                  Maaf, kami sedang mengalami kesulitan untuk memuat daftar
                  event. Ini mungkin disebabkan oleh gangguan jaringan atau
                  server kami sedang dalam pemeliharaan.
                </p>
                <Button
                  onClick={fetchEvents}
                  className="bg-white text-primary-400 hover:bg-white/90 px-6 py-2 rounded-md transition-colors w-fit"
                >
                  Coba Muat Ulang
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-[80%] mx-auto py-20">
        <PlaceholderCard />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="bg-white w-full h-full min-h-screen py-20">
        <div className="w-[80%] mx-auto space-y-20">
          <div className="flex justify-between items-center">
            <h2 className="text-5xl font-platypi font-extrabold text-primary-500">
              Ikuti event menarik di AgrowVent!
            </h2>
          </div>
          <div className="flex justify-center">
            <div className="bg-primary-400 rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row w-full max-w-4xl h-[450px] md:h-[400px]">
              <div className="w-full md:w-1/2 bg-gray-700 flex items-center justify-center">
                <svg
                  className="w-32 h-32 text-white/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="w-full md:w-1/2 p-8 flex flex-col justify-center text-white">
                <h3 className="text-4xl font-semibold mb-4">
                  Belum Ada Event Saat Ini
                </h3>
                <p className="text-white/80 mb-6">
                  Saat ini belum ada event yang tersedia. Nantikan event menarik
                  dari kami! Anda bisa kembali lagi nanti untuk melihat event
                  terbaru.
                </p>
                <Button
                  onClick={fetchEvents}
                  className="bg-white text-primary-400 hover:bg-white/90 px-6 py-2 rounded-md transition-colors w-fit"
                >
                  Periksa Kembali
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ... keep existing return statement for normal state ...
}
