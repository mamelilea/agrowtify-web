"use client";

import { Cloud, CloudRain, Sun } from "lucide-react";

export const getWeatherIconComponent = (
  condition: string,
  size: number = 24,
) => {
  switch (condition?.toLowerCase()) {
    case "clear":
      return <Sun className={`h-${size / 4} w-${size / 4} text-yellow-400`} />;
    case "rain":
    case "drizzle":
      return (
        <CloudRain className={`h-${size / 4} w-${size / 4} text-blue-400`} />
      );
    case "clouds":
      return <Cloud className={`h-${size / 4} w-${size / 4} text-gray-400`} />;
    default:
      return <Cloud className={`h-${size / 4} w-${size / 4} text-gray-400`} />;
  }
};
