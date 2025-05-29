import { AlertCircle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WeatherErrorProps {
  errorMessage: string;
  onRetry: () => void;
}

export function WeatherError({ errorMessage, onRetry }: WeatherErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-red-500 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{errorMessage}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={onRetry}>Coba Lagi</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
