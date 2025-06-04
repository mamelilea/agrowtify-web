"use client";

import { useState, useEffect } from "react";
import { WeatherHeader } from "@/components/sections/agrocare/weather/WeatherHeader";
import { CurrentWeather } from "@/components/sections/agrocare/weather/CurrentWeather";
import { WeatherForecast } from "@/components/sections/agrocare/weather/WeatherForecast";
import { WeatherCareCard } from "@/components/sections/agrocare/weather/WeatherCareCard";
import { WeatherError } from "@/components/sections/agrocare/weather/WeatherError";
import { WeatherLoading } from "@/components/sections/agrocare/weather/WeatherLoading";
import { WeatherLoginRequired } from "@/components/sections/agrocare/weather/WeatherLoginRequired";

// Definisikan interface untuk data cuaca
interface WeatherData {
  current: {
    temp: number;
    dt: number;
  };
  daily: Array<{
    dt: number;
    temp: { day: number };
    weather: Array<{ main: string }>;
  }>;
}

export default function WeatherPage() {
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [locationName, setLocationName] = useState<string>(
    "Mendapatkan lokasi..."
  );
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    const getUserLocationAndFetchData = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const response = await fetch(
                `/api/agrocare/weather?lat=${latitude}&lon=${longitude}`
              );

              if (!response.ok) {
                const errorBody = await response.text();

                if (response.status === 401) {
                  setIsUnauthorized(true);
                  setLoading(false);
                  return;
                }

                // Only log and handle other errors
                console.error(
                  "Backend Weather API fetch failed:",
                  response.status,
                  errorBody
                );

                let errorDetail = response.statusText;
                try {
                  const errorJson = JSON.parse(errorBody);
                  errorDetail = errorJson.error || errorDetail;
                } catch (e) {
                  console.error("Error parsing error response:", e);
                }
                throw new Error(`Gagal mengambil data: ${errorDetail}`);
              }

              const data = await response.json();
              if (
                !data?.forecast?.current ||
                !data?.forecast?.daily ||
                !data?.locationName
              ) {
                throw new Error("Format data dari server tidak valid.");
              }

              setWeatherData(data.forecast);
              setLocationName(data.locationName);
              setLoading(false);
            } catch (error) {
              console.error("Error fetching data from backend:", error);
              if (!isUnauthorized) {
                setLocationError(
                  error instanceof Error
                    ? error.message
                    : "Terjadi kesalahan saat mengambil data. Silakan coba lagi."
                );
              }
              setLoading(false);
            }
          },
          (error) => {
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
            }
            setLocationError(errorMessage);
            setLoading(false);
          }
        );
      } else {
        setLocationError("Browser tidak mendukung geolokasi.");
        setLoading(false);
      }
    };

    getUserLocationAndFetchData();
  }, []);

  if (loading) return <WeatherLoading />;
  if (isUnauthorized) return <WeatherLoginRequired />;
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
    <div className="container mx-auto py-30 px-4">
      <div className="bg-primary-200 text-white p-8 rounded-lg mb-8 shadow-xl">
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
