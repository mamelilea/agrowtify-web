// src/app/admin/(admin_pages)/video/page.tsx
import { Play, Plus } from 'lucide-react';

export default function EditAgroguideVideoPage() {
  const videos = Array(6).fill({
    title: "Lorem ipsum est morbi consectetur",
    description: "Lorem ipsum morbi consectetur congue sem turpis mauris felis quisque eu amet porttitor iaculis ac. Lorem ipsum morbi consectetur congue.",
    thumbnail: "/api/placeholder/300/200"
  });

  return (
    <div className="bg-green-600 min-h-full p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-green-100 mb-8" style={{ fontFamily: 'serif' }}>
          Edit Agroguide: Video
        </h1>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {videos.map((video, index) => (
            <div key={index} className="bg-green-700 bg-opacity-60 rounded-lg p-4">
              {/* Video Thumbnail */}
              <div className="relative mb-4 rounded-lg overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt="Video thumbnail"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                    <Play size={24} className="text-green-600 ml-1" />
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <h3 className="text-white font-semibold text-lg mb-2">{video.title}</h3>
              <p className="text-green-100 text-sm mb-4 leading-relaxed">
                {video.description}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm font-medium transition-colors">
                  Update
                </button>
                <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition-colors">
                  Delete
                </button>
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