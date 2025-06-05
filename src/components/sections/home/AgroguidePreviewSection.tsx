import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { AgroguideContent } from "@prisma/client";

interface ErrorStateProps {
  onRetry: () => void;
}

const ErrorState = ({ onRetry }: ErrorStateProps) => (
  <div className="bg-primary-100 min-h-screen py-20">
    <div className="w-[80%] mx-auto">
      <div className="bg-primary-200 rounded-xl p-8 text-center max-w-2xl mx-auto">
        <div className="mb-6">
          <svg
            className="w-24 h-24 mx-auto text-white/60"
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
        <h3 className="text-2xl font-platypi font-bold text-white mb-3">
          Oops! Terjadi Gangguan Teknis
        </h3>
        <p className="text-white/60 mb-6">
          Maaf, kami sedang mengalami kesulitan untuk memuat konten AgrowGuide.
          Ini mungkin disebabkan oleh gangguan jaringan atau server kami sedang
          dalam pemeliharaan.
        </p>
        <div className="space-y-4">
          <Button
            onClick={onRetry}
            className="bg-white text-primary-200 hover:bg-white/90 px-6 py-2 rounded-md transition-colors"
          >
            Coba Muat Ulang
          </Button>
          <p className="text-sm text-white/40">
            Jika masalah berlanjut, silakan coba beberapa saat lagi
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default function AgroguidePreviewSection() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [articles, setArticles] = useState<AgroguideContent[]>([]);
  const [videos, setVideos] = useState<AgroguideContent[]>([]);

  const fetchContent = async (contentType: "ARTICLE" | "VIDEO") => {
    try {
      const response = await fetch(
        `/api/agroguide?type=${contentType}&limit=3`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch ${contentType.toLowerCase()} content`);
      }
      const data = await response.json();
      console.log(`API Response for ${contentType}:`, data); // Debug log
      if (!data.content || !Array.isArray(data.content)) {
        throw new Error(
          `Invalid response format for ${contentType.toLowerCase()}`
        );
      }
      // Filter content by type and take only the latest 3 items
      const filteredContent = data.content
        .filter((item: AgroguideContent) => item.contentType === contentType)
        .sort(
          (a: AgroguideContent, b: AgroguideContent) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 3);

      console.log(`Filtered ${contentType} content:`, filteredContent); // Debug log
      return filteredContent;
    } catch (err) {
      console.error(`Error fetching ${contentType.toLowerCase()}:`, err);
      throw err;
    }
  };

  const loadAllContent = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both article and video content in parallel
      const [articleData, videoData] = await Promise.allSettled([
        fetchContent("ARTICLE"),
        fetchContent("VIDEO"),
      ]);

      // Handle article results
      if (articleData.status === "fulfilled") {
        setArticles(articleData.value);
      } else {
        console.error("Failed to fetch articles:", articleData.reason);
      }

      // Handle video results
      if (videoData.status === "fulfilled") {
        setVideos(videoData.value);
      } else {
        console.error("Failed to fetch videos:", videoData.reason);
      }

      // Set error if both failed
      if (
        articleData.status === "rejected" &&
        videoData.status === "rejected"
      ) {
        setError("Failed to load both articles and videos");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllContent();
  }, []);

  const formatDate = (dateInput: string | Date) => {
    const date =
      typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("id-ID", options);
  };

  const renderContentCard = (content: AgroguideContent) => (
    <div
      key={content.id}
      className="bg-primary-200 rounded-lg shadow-md overflow-hidden flex flex-col"
    >
      <img
        src={
          content.thumbnail ||
          (content.contentType === "VIDEO"
            ? "/path/to/default/video-thumbnail.png"
            : "/path/to/default/article-thumbnail.png")
        }
        alt={content.title}
        className={`w-full object-cover ${
          content.contentType === "ARTICLE" ? "h-40" : "h-48"
        }`}
      />
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <p className="text-sm text-white/30 mb-1">
            {formatDate(content.createdAt)}
          </p>
          <h3 className="text-lg font-semibold text-white mb-2">
            {content.title}
          </h3>
          <p className="text-white/60 text-sm line-clamp-3">
            {content.description}
          </p>
        </div>
      </div>
    </div>
  );

  const PlaceholderCard = () => (
    <div className="bg-primary-200 rounded-lg shadow-md overflow-hidden flex flex-col animate-pulse">
      <div className="w-full h-48 bg-gray-700"></div>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-6 bg-gray-700 rounded w-3/4 mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const handleRetry = () => {
    loadAllContent();
  };

  if (loading) {
    return (
      <div className="bg-primary-100 h-full min-h-screen py-20">
        <div className="w-[80%] mx-auto space-y-12">
          {/* Articles Section */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-5xl font-platypi font-extrabold text-white">
                Artikel dari AgrowGuide untuk anda
              </h2>
              <Button className="bg-primary-200 text-white px-6 py-2 rounded-md hover:bg-primary-500 transition-colors mt-3">
                <a href="#">Selengkapnya</a>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <PlaceholderCard key={index} />
              ))}
            </div>
          </div>

          {/* Videos Section */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-5xl font-platypi font-extrabold text-white">
                Video dari AgrowGuide untuk anda
              </h2>
              <Button className="bg-primary-200 text-white px-6 py-2 rounded-md hover:bg-primary-500 transition-colors mt-3">
                <a href="#">Selengkapnya</a>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <PlaceholderCard key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && articles.length === 0 && videos.length === 0) {
    return <ErrorState onRetry={handleRetry} />;
  }

  return (
    <div className="bg-primary-100 h-full min-h-screen py-20">
      <div className="w-[80%] mx-auto space-y-12">
        {/* Articles Section */}
        {articles.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-5xl font-platypi font-extrabold text-white">
                Artikel dari AgrowGuide untuk anda
              </h2>
              <Button className="bg-primary-200 text-white px-6 py-2 rounded-md hover:bg-primary-500 transition-colors mt-3">
                <a href="#">Selengkapnya</a>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(renderContentCard)}
            </div>
          </div>
        )}

        {/* Videos Section */}
        {videos.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-5xl font-platypi font-extrabold text-white">
                Video dari AgrowGuide untuk anda
              </h2>
              <Button className="bg-primary-200 text-white px-6 py-2 rounded-md hover:bg-primary-500 transition-colors mt-3">
                <a href="#">Selengkapnya</a>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map(renderContentCard)}
            </div>
          </div>
        )}

        {/* Show error state only if both sections failed */}
        {error && articles.length === 0 && videos.length === 0 && (
          <ErrorState onRetry={handleRetry} />
        )}
      </div>
    </div>
  );
}
