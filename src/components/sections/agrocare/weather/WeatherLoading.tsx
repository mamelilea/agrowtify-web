import { Loader2 } from "lucide-react";

export function WeatherLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-lg">Mengambil data cuaca dan lokasi Anda...</p>
    </div>
  );
}
