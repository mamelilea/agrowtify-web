import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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
  contactInfo?: string | null;
  website?: string | null;
  categoryId: string;
  category: Category;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  createdBy: { name?: string | null; id: string };
}

export default function AgroweventPreviewSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

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
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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

  const formatTime = (startDateString: string, endDateString: string) => {
    const start = new Date(startDateString);
    const end = new Date(endDateString);
    const startHours = start.getHours().toString().padStart(2, "0");
    const startMinutes = start.getMinutes().toString().padStart(2, "0");
    const endHours = end.getHours().toString().padStart(2, "0");
    const endMinutes = end.getMinutes().toString().padStart(2, "0");

    return `${startHours}.${startMinutes} - ${endHours}.${endMinutes} WIB`;
  };

  const handleNext = () => {
    setCurrentEventIndex((prevIndex) =>
      prevIndex === events.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevious = () => {
    setCurrentEventIndex((prevIndex) =>
      prevIndex === 0 ? events.length - 1 : prevIndex - 1
    );
  };

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
              Ikuti event menarik di Agrowevent!
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
                  onClick={() => window.location.reload()}
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
  if (loading)
    return (
      <div className="w-[80%] mx-auto py-20">
        <PlaceholderCard />
      </div>
    );
  if (events.length === 0)
    return (
      <div className="text-center py-20 text-gray-600">
        No upcoming events found.
      </div>
    );

  return (
    <div className="bg-white w-full h-full min-h-screen py-20">
      <div className="w-[80%] mx-auto space-y-20">
        <div className="flex justify-between items-center">
          <h2 className="text-5xl font-platypi font-extrabold text-primary-500">
            Ikuti event menarik di Agrowevent!
          </h2>

          <Button className="bg-primary-200 text-white px-6 py-2 rounded-md hover:bg-primary-500 transition-colors mt-3">
            <a href="#">Selengkapnya</a>
          </Button>
        </div>

        <div className="relative flex items-center justify-center">
          {currentEventIndex > 0 && (
            <button
              className="absolute left-0 z-10 p-3 bg-white rounded-full shadow-md focus:outline-none hover:bg-gray-100 transition-colors -translate-x-1/2"
              aria-label="Previous event"
              onClick={handlePrevious}
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
            </button>
          )}

          <div className="bg-primary-400 rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row w-full max-w-4xl h-[500px]">
            {" "}
            <div className="w-full md:w-2/5 h-full ">
              <img
                src={
                  events[currentEventIndex].imageUrl ||
                  "/assets/images/event-placeholder.png"
                }
                alt={events[currentEventIndex].title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full md:w-3/5 p-8 flex flex-col justify-center text-white h-full overflow-hidden">
              <h3 className="text-4xl font-semibold mb-4 line-clamp-2">
                {events[currentEventIndex].title}
              </h3>
              <p className="text-white/80 mb-6 line-clamp-3">
                {events[currentEventIndex].description}
              </p>{" "}
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
                    {formatDate(events[currentEventIndex].startDate)}
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
                    {formatTime(
                      events[currentEventIndex].startDate,
                      events[currentEventIndex].endDate
                    )}
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
                    {events[currentEventIndex].location ||
                      events[currentEventIndex].eventType}
                  </span>{" "}
                </div>
              </div>
            </div>
          </div>

          {currentEventIndex < events.length - 1 && (
            <button
              className="absolute right-0 z-10 p-3 bg-white rounded-full shadow-md focus:outline-none hover:bg-gray-100 transition-colors translate-x-1/2"
              aria-label="Next event"
              onClick={handleNext}
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          )}
        </div>

        <div className="flex justify-center space-x-2 mt-6">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentEventIndex(index)}
              className={`block w-3 h-3 rounded-full transition-colors ${
                index === currentEventIndex
                  ? "bg-primary-500"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to event ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
