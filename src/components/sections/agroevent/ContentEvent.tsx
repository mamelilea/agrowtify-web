import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, RefreshCw } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  location?: string | null;
  eventType: "ONLINE" | "OFFLINE" | "HYBRID";
  startDate: string;
  endDate: string;
  imageUrl?: string | null;
  organizer: string;
  category: Category;
}

interface ContentEventProps {
  searchTerm?: string;
}

interface EventErrorStateProps {
  onRetry: () => void;
}

function EventErrorState({ onRetry }: EventErrorStateProps) {
  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center py-20">
      <div className="max-w-md w-full mx-auto text-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-platypi font-bold text-gray-800 mb-2">
              Gangguan pada Event
            </h3>
            <p className="text-gray-600 mb-6">
              Maaf, kami sedang mengalami kesulitan untuk memuat daftar event.
              Tim kami sedang bekerja untuk memperbaiki masalah ini.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={onRetry}
              className="w-full bg-primary-400 hover:bg-primary-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
            >
              <RefreshCw className="w-5 h-5" />
              Coba Muat Ulang
            </Button>
            <p className="text-sm text-gray-500">
              Jika masalah berlanjut, silakan coba beberapa saat lagi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventLoadingState() {
  return (
    <div className="w-full flex flex-col items-center space-y-8 py-10">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-primary-400/20 rounded-lg shadow-lg flex flex-col md:flex-row w-full max-w-4xl h-[500px] overflow-hidden animate-pulse"
        >
          {/* Image skeleton */}
          <div className="w-full md:w-2/5 h-full bg-gray-300"></div>

          {/* Content skeleton */}
          <div className="w-full md:w-3/5 p-8 flex flex-col justify-center space-y-6">
            <div className="h-12 bg-gray-300 rounded w-3/4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded w-4/6"></div>
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-48"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ContentEvent({ searchTerm = "" }: ContentEventProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/events?limit=10");
      if (!res.ok) {
        throw new Error("Gagal memuat event");
      }
      const data = await res.json();
      setEvents(data.events || []);
      setFilteredEvents(data.events || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      setEvents([]);
      setFilteredEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEvents(events);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = events.filter((event) => {
      return (
        event.title.toLowerCase().includes(searchTermLower) ||
        event.description.toLowerCase().includes(searchTermLower) ||
        event.location?.toLowerCase().includes(searchTermLower) ||
        event.category.name.toLowerCase().includes(searchTermLower) ||
        event.organizer.toLowerCase().includes(searchTermLower)
      );
    });
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  if (loading) return <EventLoadingState />;

  if (error) return <EventErrorState onRetry={fetchEvents} />;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("id-ID", options);
  };

  if (filteredEvents.length === 0) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center py-20">
        <div className="max-w-md w-full mx-auto text-center px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-platypi font-bold text-gray-800 mb-2">
                {searchTerm ? "Event Tidak Ditemukan" : "Belum Ada Event"}
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? "Coba ubah kata kunci pencarian Anda"
                  : "Belum ada event yang tersedia saat ini. Silakan cek kembali nanti."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatTime = (startDateString: string, endDateString: string) => {
    const start = new Date(startDateString);
    const end = new Date(endDateString);
    const startHours = start.getHours().toString().padStart(2, "0");
    const startMinutes = start.getMinutes().toString().padStart(2, "0");
    const endHours = end.getHours().toString().padStart(2, "0");
    const endMinutes = end.getMinutes().toString().padStart(2, "0");
    return `${startHours}.${startMinutes} - ${endHours}.${endMinutes} WIB`;
  };

  if (loading)
    return (
      <div className="w-full h-screen flex justify-center items-center text-3xl font-bold">
        Tunggu Sebentar yah
      </div>
    );

  if (filteredEvents.length === 0) {
    return (
      <div className="w-full flex flex-col items-center space-y-8 py-10">
        <div className="text-center text-gray-600 text-xl min-h-[50vh]">
          {searchTerm
            ? "Tidak ada event yang ditemukan"
            : "Belum ada event yang tersedia"}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center space-y-8 py-10">
      {filteredEvents.map((event) => (
        <div
          key={event.id}
          className="bg-primary-400 rounded-lg shadow-lg flex flex-col md:flex-row w-full max-w-4xl h-[500px] overflow-hidden"
        >
          <div className="w-full md:w-2/5 h-full">
            <img
              src={event.imageUrl || "/assets/images/event-placeholder.png"}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-full md:w-3/5 p-8 flex flex-col justify-center text-white h-full overflow-hidden">
            <h3 className="text-4xl font-semibold mb-4 line-clamp-2">
              {event.title}
            </h3>
            <p className="text-white/80 mb-6 line-clamp-3">
              {event.description}
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <svg
                  className="w-6 h-6 text-white flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                <span className="text-white/90 line-clamp-1">
                  {formatDate(event.startDate)}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <svg
                  className="w-6 h-6 text-white flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span className="text-white/90 line-clamp-1">
                  {formatTime(event.startDate, event.endDate)}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <svg
                  className="w-6 h-6 text-white flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                <span className="text-white/90 line-clamp-1">
                  {event.location || event.eventType}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
