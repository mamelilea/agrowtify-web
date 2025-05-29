// components/sections/agroguide/AgroguideCard.tsx
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface AgroguideCardProps {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  url: string;
  contentType: "ARTICLE" | "VIDEO";
}

export default function AgroguideCard({
  id,
  title,
  description,
  thumbnailUrl,
  url,
  contentType,
}: AgroguideCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    if (contentType === "VIDEO" && url) {
      router.push(`/agroguide/video/${id}`);
    } else if (contentType === "ARTICLE" && url) {
      router.push(`/agroguide/artikel/${id}`);
    }
  };

  return (
    <div
      className="bg-primary-100 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group h-95"
      onClick={handleCardClick}
    >
      <div className="relative w-full h-1/2 overflow-hidden">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <div className="text-white text-6xl opacity-50">
              {contentType === "VIDEO" ? "▶" : "📄"}
            </div>
          </div>
        )}
        {/* Play button overlay for videos */}
        {contentType === "VIDEO" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-l-6 border-t-3 border-b-3 border-l-green-600 border-t-transparent border-b-transparent ml-1"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col h-1/2 justify-between">
        <div>
          <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-gray-300 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-white line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Content type badge */}
        <div className="mt-4 flex justify-between items-center">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              contentType === "VIDEO"
                ? "bg-red-100 text-red-600"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            {contentType === "VIDEO" ? "Video" : "Artikel"}
          </span>

          <div className="text-white transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
