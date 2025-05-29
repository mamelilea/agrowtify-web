"use client";

import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation"; // Router tidak dibutuhkan
import {
  Card,
  CardContent,
  CardFooter, // Tetap impor jika Button digunakan untuk error retry
  CardHeader, // Tetap impor jika Button digunakan untuk error retry
  CardTitle, // Tetap impor jika Button digunakan untuk error retry
} from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Tetap impor jika Button digunakan untuk error retry
import {
  Loader2,
  AlertCircle,
  MapPin,
  Cloud,
  CloudRain,
  Sun,
  Thermometer,
} from "lucide-react"; // Tambahkan icons cuaca
import { format, fromUnixTime } from "date-fns";
import { id } from "date-fns/locale";
import { WeatherHeader } from "@/components/sections/agrocare/weather/WeatherHeader";
import { CurrentWeather } from "@/components/sections/agrocare/weather/CurrentWeather";
import { WeatherForecast } from "@/components/sections/agrocare/weather/WeatherForecast";
import { WeatherCareCard } from "@/components/sections/agrocare/weather/WeatherCareCard";
import { WeatherError } from "@/components/sections/agrocare/weather/WeatherError";
import { WeatherLoading } from "@/components/sections/agrocare/weather/WeatherLoading";

// import WeatherForecastDisplay from "@/components/sections/agrocare/weather-forecast-display/WeatherForecastDisplay"; // Tidak digunakan
// import CareRecommendations from "@/components/sections/agrocare/care-recommendations/CareRecommendations"; // Tidak digunakan

// Helper function to get weather icon component based on condition
const getWeatherIconComponent = (condition: string, size: number = 24) => {
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

export default function WeatherPage() {
  // const router = useRouter();

  // --- State untuk data cuaca dan lokasi ---
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [locationName, setLocationName] = useState<string>(
    "Mendapatkan lokasi..." // Default text saat loading
  );

  // --- Get user location & fetch data dari backend ---
  useEffect(() => {
    const getUserLocationAndFetchData = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;

              // Panggil API backend lokal yang sekarang mengurus Nominatim dan OpenWeather
              const response = await fetch(
                `/api/agrocare/weather?lat=${latitude}&lon=${longitude}`
              );

              if (!response.ok) {
                const errorBody = await response.text();
                console.error(
                  "Backend Weather API fetch failed:",
                  response.status,
                  errorBody
                );
                let errorDetail = response.statusText;
                try {
                  const errorJson = JSON.parse(errorBody);
                  errorDetail = errorJson.error || errorDetail;
                } catch {}

                throw new Error(`Gagal mengambil data: ${errorDetail}`);
              }

              const data = await response.json();

              // Validasi dan simpan data cuaca dan nama lokasi dari respons backend
              if (
                !data ||
                !data.forecast ||
                !data.forecast.current ||
                !data.forecast.daily ||
                !data.locationName // Pastikan ada locationName
              ) {
                console.error("Invalid data structure from backend API:", data);
                throw new Error("Format data dari server tidak valid.");
              }

              setWeatherData(data.forecast); // Data cuaca
              setLocationName(data.locationName); // Nama lokasi dari backend

              setLoading(false); // Loading selesai
            } catch (error: any) {
              console.error("Error fetching data from backend:", error);
              setLocationError(
                error.message ||
                  "Terjadi kesalahan saat mengambil data. Silakan coba lagi."
              );
              setLoading(false);
            }
          },
          (error) => {
            // Geolocation error handler
            console.error("Geolocation error:", error);
            let errorMessage = "Gagal mendapatkan lokasi. ";
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage +=
                  "Mohon izinkan akses lokasi di pengaturan browser Anda.";
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage += "Informasi lokasi tidak tersedia.";
                break;
              case error.TIMEOUT:
                errorMessage += "Permintaan lokasi timed out.";
                break;
              default:
                errorMessage += "Terjadi kesalahan saat mendapatkan lokasi.";
                break;
            }
            setLocationError(errorMessage);
            setLoading(false);
          }
        );
      } else {
        // Browser does not support geolocation
        setLocationError("Browser tidak mendukung geolokasi.");
        setLoading(false);
      }
    };

    getUserLocationAndFetchData();
  }, []); // Efek ini hanya berjalan sekali saat komponen mount

  if (loading) return <WeatherLoading />;
  if (locationError)
    return (
      <WeatherError
        errorMessage={locationError}
        onRetry={() => window.location.reload()}
      />
    );
  if (!weatherData)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Data cuaca tidak tersedia.
      </div>
    );

  const currentTemp = Math.round(weatherData.current.temp);
  const dailyForecast = weatherData.daily.slice(0, 7);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-green-700 text-white p-8 rounded-lg mb-8 shadow-xl">
        <WeatherHeader locationName={locationName} />
        <CurrentWeather
          currentTemp={currentTemp}
          timestamp={weatherData.current.dt}
        />
        <WeatherForecast dailyForecast={dailyForecast} />
      </div>

      <WeatherCareCard
        title="Cuaca hari ini sangat cerah!"
        description="Cuaca di daerah anda sedang cerah, pastikan tanaman anda tetap mendapatkan cukup air dengan menyiramnya secara teratur, terutama di pagi atau sore hari agar air tidak cepat menguap. Periksa kelembaban tanah secara berkala jika terasa kering saat disentuh, saatnya menyiram!"
      />
    </div>
  );
}
