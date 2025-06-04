import { Card, CardContent } from "@/components/ui/card";

interface WeatherCareCardProps {
  title: string;
  description: string;
}

export function WeatherCareCard({ title, description }: WeatherCareCardProps) {
  return (
    <Card className="bg-primary-200 text-white border-primary-200">
      <CardContent className="pt-6">
        <p className="text-lg font-semibold mb-2">{title}</p>
        <p className="text-sm opacity-90">{description}</p>
      </CardContent>
    </Card>
  );
}
