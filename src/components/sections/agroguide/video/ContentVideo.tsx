"use client";

import React, { useEffect, useState, useCallback } from "react";
import AgroguideCard from "../AgroguideCard";
import { AgroguideContent } from "@prisma/client";
import { Category } from "@/lib/api/categories";
import { Search, Filter } from "lucide-react";

interface ContentVideoProps {
  categories: Category[];
}

interface AgroguideContentWithCategory extends AgroguideContent {
  category: Category;
}

export default function ContentVideo({ categories }: ContentVideoProps) {
  const [videos, setVideos] = useState<AgroguideContentWithCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debounce = useCallback(
    <T extends (...args: unknown[]) => void>(func: T, delay: number) => {
      let timeoutId: NodeJS.Timeout;
      return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
      };
    },
    []
  );

  const fetchContent = useCallback(
    async (category: string | null, search: string) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.append("type", "VIDEO");
        if (category) params.append("category", category);
        if (search.trim()) params.append("search", search.trim());
        params.append("page", "1");
        params.append("limit", "12");

        const res = await fetch(`/api/agroguide?${params.toString()}`);

        if (!res.ok) {
          throw new Error(`Error fetching videos: ${res.statusText}`);
        }

        const data = await res.json();
        setVideos(data.content);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
        setVideos([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const debouncedFetchContent = useCallback(
    debounce((category: string | null, search: string) => {
      fetchContent(category, search);
    }, 300),
    [fetchContent, debounce]
  );

  useEffect(() => {
    fetchContent(selectedCategory, searchTerm);
  }, []);

  useEffect(() => {
    fetchContent(selectedCategory, searchTerm);
  }, [selectedCategory, fetchContent]);

  useEffect(() => {
    if (searchTerm !== "") {
      debouncedFetchContent(selectedCategory, searchTerm);
    } else {
      fetchContent(selectedCategory, searchTerm);
    }
  }, [searchTerm, selectedCategory, debouncedFetchContent, fetchContent]);

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="bg-gradient-to-b from-primary-200 to-white text-white py-16 pt-40 px-6">
        <div className="max-w-6xl mx-auto text-center font-platypi text-primary-400">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-5xl md:text-6xl font-bold">Agroguide</h1>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold opacity-90">
            Video Edukasi
          </h2>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 bg-white">
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Pencarian video..."
              className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white shadow-lg bg-primary-400"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <hr className="border-gray-200 mb-8" />

        <div className="mb-8 flex flex-col justify-center items-start">
          <div className="flex flex-wrap gap-3 items-center justify-center md:justify-start">
            <button
              className={`px-6 py-3 text-sm font-medium border rounded-full transition-all duration-200 ${
                selectedCategory === null
                  ? "bg-primary-400 text-white border-primary-400 shadow-lg"
                  : "border-primary-200 text-gray-700 hover:bg-gray-50 hover:border-primary-400"
              }`}
              onClick={() => handleCategoryClick(null)}
            >
              Semua
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-6 py-3 text-sm font-medium border rounded-full transition-all duration-200 ${
                  selectedCategory === category.id
                    ? "bg-primary-400 text-white border-primary-400 shadow-lg"
                    : "border-primary-200 text-gray-700 hover:bg-gray-50 hover:border-primary-400"
                }`}
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.name}
              </button>
            ))}

            <button
              className="px-4 py-3 border border-gray-300 rounded-full hover:bg-gray-50 text-gray-700 transition-colors"
              title="Filter"
              onClick={clearFilters}
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>

          {(selectedCategory || searchTerm) && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <span>Filter aktif:</span>
              {selectedCategory && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  {categories.find((c) => c.id === selectedCategory)?.name}
                </span>
              )}
              {searchTerm && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  "{searchTerm}"
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-red-600 hover:text-red-800 ml-2 underline"
              >
                Hapus semua
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600">Memuat video...</span>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-red-500 text-lg mb-4">❌ Error: {error}</div>
            <button
              onClick={() => fetchContent(selectedCategory, searchTerm)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        ) : videos.length > 0 ? (
          <>
            <div className="mb-6 text-gray-600">
              Menampilkan {videos.length} video
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video) => (
                <AgroguideCard
                  key={video.id}
                  id={video.id}
                  title={video.title}
                  description={video.description}
                  thumbnailUrl={video.thumbnail || undefined}
                  url={video.url}
                  contentType={video.contentType}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-gray-500 text-lg mb-4">
              🎥 Tidak ada video yang ditemukan
            </div>
            <p className="text-gray-400 mb-6">
              Coba ubah filter atau kata kunci pencarian Anda
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
