import { Card, CardContent } from "@/components/ui/card";

interface WeatherCareCardProps {
  title: string;
  description: string;
}

export function WeatherCareCard({ title, description }: WeatherCareCardProps) {
  return (
    <Card className="bg-green-800 text-white border-green-700">
      <CardContent className="pt-6">
        <p className="text-lg font-semibold mb-2">{title}</p>
        <p className="text-sm opacity-90">{description}</p>
      </CardContent>
    </Card>
  );
}
