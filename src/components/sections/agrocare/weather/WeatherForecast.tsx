import { format, fromUnixTime } from "date-fns";
import { getWeatherIconComponent } from "./weather-icons";

interface WeatherForecastProps {
  dailyForecast: Array<{
    dt: number;
    temp: { day: number };
    weather: Array<{ main: string }>;
  }>;
}

export function WeatherForecast({ dailyForecast }: WeatherForecastProps) {
  return (
    <div className="flex overflow-x-auto space-x-4 py-4 justify-center">
      {dailyForecast.map((day) => (
        <div
          key={day.dt}
          className="flex-shrink-0 w-24 bg-green-800 rounded-lg p-3 text-center"
        >
          <p className="text-sm opacity-90 mb-2">
            {format(fromUnixTime(day.dt), "dd/MM")}
          </p>
          <div className="flex justify-center mb-2">
            {getWeatherIconComponent(day.weather[0]?.main, 40)}
          </div>
          <p className="text-xl font-bold">{Math.round(day.temp.day)}°</p>
        </div>
      ))}
    </div>
  );
}
