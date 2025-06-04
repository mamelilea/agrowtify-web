// src/app/admin/(admin_pages)/event/page.tsx
import { Calendar, Clock, MapPin, Plus } from 'lucide-react';

export default function EditAgrowventPage() {
  const events = Array(2).fill({
    title: "Lorem ipsum non",
    description: "Lorem ipsum felis placerat massa nunc elementum eget blandit diam nibh adipiscing eu ut pharetra id at risus amet magna amet interdum sollicitudin commodo consectetur maecenas at elit a mattis.",
    date: "Minggu, 13 November 2025",
    time: "10.00 - 12.00 WIB",
    location: "Gedung Samantha Krida, Universitas Brawijaya",
    image: "/api/placeholder/400/300"
  });

  return (
    <div className="bg-green-600 min-h-full p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-green-100 mb-8" style={{ fontFamily: 'serif' }}>
          Edit Agrowvent
        </h1>

        {/* Events List */}
        <div className="space-y-8 mb-8">
          {events.map((event, index) => (
            <div key={index} className="bg-green-700 bg-opacity-60 rounded-lg p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Event Image */}
                <div className="lg:w-1/3">
                  <img
                    src={event.image}
                    alt="Event"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>

                {/* Event Details */}
                <div className="lg:w-2/3">
                  <h2 className="text-2xl font-bold text-white mb-4">{event.title}</h2>
                  <p className="text-green-100 text-sm leading-relaxed mb-6">
                    {event.description}
                  </p>

                  {/* Event Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-white">
                      <Calendar size={20} className="text-green-200" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white">
                      <Clock size={20} className="text-green-200" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white">
                      <MapPin size={20} className="text-green-200" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded font-medium transition-colors">
                      Update
                    </button>
                    <button className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-medium transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Button */}
        <div className="fixed bottom-8 right-8">
          <button className="w-14 h-14 bg-green-700 hover:bg-green-800 text-white rounded-full shadow-lg flex items-center justify-center transition-colors">
            <Plus size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}