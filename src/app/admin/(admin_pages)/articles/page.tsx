// src/app/admin/(admin_pages)/article/page.tsx
import { Plus } from 'lucide-react';

export default function EditAgroguideArticlePage() {
  const articles = Array(6).fill({
    title: "Lorem ipsum est morbi consectetur",
    description: "Lorem ipsum morbi consectetur congue sem turpis mauris felis quisque eu amet porttitor iaculis ac.",
    date: "Minggu, 20 Oktober 2023",
    thumbnail: "/api/placeholder/300/200"
  });

  return (
    <div className="bg-green-600 min-h-full p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-green-100 mb-8" style={{ fontFamily: 'serif' }}>
          Edit Agroguide: Artikel
        </h1>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {articles.map((article, index) => (
            <div key={index} className="bg-green-700 bg-opacity-60 rounded-lg p-4">
              {/* Article Thumbnail */}
              <div className="relative mb-4 rounded-lg overflow-hidden">
                <img
                  src={article.thumbnail}
                  alt="Article thumbnail"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                  {article.date}
                </div>
              </div>

              {/* Article Info */}
              <h3 className="text-white font-semibold text-lg mb-2">{article.title}</h3>
              <p className="text-green-100 text-sm mb-4 leading-relaxed">
                {article.description}
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