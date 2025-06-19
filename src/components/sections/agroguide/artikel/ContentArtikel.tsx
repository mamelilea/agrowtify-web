"use client";

import React, { useEffect, useState, useCallback } from "react";
import AgroguideCard from "../AgroguideCard";
import { AgroguideContent } from "@prisma/client";
import { Category } from "@/lib/api/categories";
import { Search, Filter } from "lucide-react";
import ErrorState from "../ErrorState";
import LoadingState from "../LoadingState";

interface ContentArtikelProps {
  categories: Category[];
}

export default function ContentArtikel({ categories }: ContentArtikelProps) {
  const [articles, setArticles] = useState<AgroguideContent[]>([]);
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
          type: "ARTICLE",
          ...(categoryId && { category: categoryId }),
          ...(search && { search }),
        });

        const response = await fetch(
          `/api/agroguide?${queryParams.toString()}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }

        const data = await response.json();
        console.log("DATA ARTIKEL:", data);
        setArticles(data.content || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching articles"
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
            Artikel Edukasi
          </h2>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Pencarian artikel..."
              className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2  focus:border-transparent text-white shadow-lg bg-primary-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <hr className="border-gray-200 mb-8" />

        <div className="mb-8">
          <div className="flex flex-wrap gap-3 items-center justify-center md:justify-start">
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
          <LoadingState contentType="ARTICLE" />
        ) : error ? (
          <ErrorState
            contentType="ARTICLE"
            onRetry={() => fetchContent(selectedCategory, searchTerm)}
          />
        ) : articles.length > 0 ? (
          <>
            <div className="mb-6 text-gray-600">
              Menampilkan {articles.length} artikel
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <AgroguideCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  description={article.description}
                  thumbnailUrl={article.thumbnail || undefined}
                  url={article.url}
                  contentType={article.contentType}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-gray-500 text-lg mb-4">
              📄 Tidak ada artikel yang ditemukan
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
