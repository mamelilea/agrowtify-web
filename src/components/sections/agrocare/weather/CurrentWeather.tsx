import { format, fromUnixTime } from "date-fns";
import { id } from "date-fns/locale";

interface CurrentWeatherProps {
  currentTemp: number;
  timestamp: number;
}

export function CurrentWeather({
  currentTemp,
  timestamp,
}: CurrentWeatherProps) {
  const currentDayAndDate = format(
    fromUnixTime(timestamp),
    "EEEE, d MMMM yyyy",
    { locale: id }
  );

  return (
    <div className="text-center">
      <p className="text-7xl font-bold mb-2">{currentTemp}°</p>
      <p className="text-xl opacity-90">{currentDayAndDate}</p>
    </div>
  );
}
