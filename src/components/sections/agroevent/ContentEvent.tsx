import React, { useEffect, useState } from "react";

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

export default function ContentEvent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const res = await fetch("/api/events?limit=10");
      const data = await res.json();
      setEvents(data.events || []);
      setLoading(false);
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

  if (loading)
    return (
      <div className="w-full h-screen flex justify-center items-center text-3xl font-bold">
        Tunggu Sebentar yah
      </div>
    );

  return (
    <div className="w-full flex flex-col items-center space-y-8 py-10">
      {events.map((event) => (
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
