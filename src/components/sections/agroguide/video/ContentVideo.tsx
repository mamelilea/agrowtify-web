"use client";

import React, { useEffect, useState, useCallback } from "react";
import AgroguideCard from "../AgroguideCard";
import { AgroguideContent } from "@prisma/client";
import { Category } from "@/lib/api/categories";
import { Search, Filter } from "lucide-react";
import ErrorState from "../ErrorState";
import LoadingState from "../LoadingState";

interface ContentVideoProps {
  categories: Category[];
}

export default function ContentVideo({ categories }: ContentVideoProps) {
  const [videos, setVideos] = useState<AgroguideContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchContent = useCallback(
    async (categoryId?: string, search?: string) => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams({
          contentType: "VIDEO",
          ...(categoryId && { categoryId }),
          ...(search && { search }),
        });

        const response = await fetch(
          `/api/agroguide?${queryParams.toString()}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch videos");
        }

        const data = await response.json();
        setVideos(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching videos"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchContent(selectedCategory, searchTerm);
  }, [fetchContent, selectedCategory, searchTerm]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="bg-gradient-to-b from-primary-200 to-white text-white py-16 pt-40 px-6">
        <div className="max-w-6xl mx-auto text-center font-platypi text-primary-400">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Agroguide</h1>
          <h2 className="text-2xl md:text-3xl font-light opacity-90">
            Video Edukasi
          </h2>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari video..."
                className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white shadow-lg bg-primary-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400" />
              <span className="text-sm text-gray-400">Filter:</span>
            </div>
          </div>

          {/* Category Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className={`px-6 py-3 text-sm font-medium border rounded-full transition-all duration-200 ${
                selectedCategory === ""
                  ? "bg-primary-400 text-white border-primary-400 shadow-lg"
                  : "border-primary-200 text-gray-700 hover:bg-gray-50 hover:border-primary-400"
              }`}
              onClick={() => setSelectedCategory("")}
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
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div>
          {loading ? (
            <LoadingState contentType="VIDEO" />
          ) : error ? (
            <ErrorState
              contentType="VIDEO"
              onRetry={() => fetchContent(selectedCategory, searchTerm)}
            />
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
    </div>
  );
}
