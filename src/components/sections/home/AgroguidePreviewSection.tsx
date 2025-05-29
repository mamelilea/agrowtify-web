import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
}

interface AgroguideContent {
  id: string;
  title: string;
  description: string;
  contentType: "ARTICLE" | "VIDEO";
  url: string;
  thumbnail?: string;
  categoryId: string;
  category: Category;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  createdBy: { name?: string | null; id: string };
}

export default function AgroguidePreviewSection() {
  const [articles, setArticles] = useState<AgroguideContent[]>([]);
  const [videos, setVideos] = useState<AgroguideContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);

        const articlesRes = await fetch("/api/agroguide?type=ARTICLE&limit=3");
        if (!articlesRes.ok) {
          throw new Error("Failed to fetch articles");
        }
        const articlesData = await articlesRes.json();
        setArticles(articlesData.content);

        const videosRes = await fetch("/api/agroguide?type=VIDEO&limit=3");
        if (!videosRes.ok) {
          throw new Error("Failed to fetch videos");
        }
        const videosData = await videosRes.json();
        setVideos(videosData.content);
      } catch (err) {
        console.error("Error fetching agroguide content:", err);
        setError("Failed to load content.");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
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
          </p>{" "}
        </div>
        {/* You can add a link here if the card is clickable */}
        {/* <a href={content.url} className="text-blue-500 hover:underline mt-3 inline-block">Read More</a> */}
      </div>
    </div>
  );

  // Placeholder card component
  const PlaceholderCard = () => (
    <div className="bg-primary-200 rounded-lg shadow-md overflow-hidden flex flex-col animate-pulse">
      {/* Placeholder Image */}
      <div className="w-full h-48 bg-gray-700"></div>
      {/* Placeholder Content */}
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

  if (loading)
    return (
      <div className="bg-primary-100 h-full min-h-screen py-20">
        <div className="w-[80%] mx-auto space-y-12">
          {/* Articles Section Loading */}
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

          {/* Videos Section Loading */}
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

  if (error)
    return <div className="text-center py-20 text-red-600">{error}</div>;

  return (
    <div className="bg-primary-100 h-full min-h-screen py-20">
      <div className="w-[80%] mx-auto space-y-12">
        {" "}
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
            {articles.map(renderContentCard)}
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
            {videos.map(renderContentCard)}
          </div>
        </div>
      </div>
    </div>
  );
}
