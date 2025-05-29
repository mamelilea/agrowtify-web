import { MapPin } from "lucide-react";

interface WeatherHeaderProps {
  locationName: string;
}

export function WeatherHeader({ locationName }: WeatherHeaderProps) {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-2">Ramalan Cuaca</h1>
      <p className="text-lg opacity-90 flex items-center justify-center mb-4">
        <MapPin className="h-5 w-5 mr-2" />
        {locationName}
      </p>
    </div>
  );
}
