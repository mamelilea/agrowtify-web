import { AlertCircle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function WeatherLoginRequired() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-yellow-500 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Login Diperlukan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Anda perlu login terlebih dahulu untuk mengakses fitur ramalan
            cuaca.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={() => router.push("/login")}
            className="bg-primary-100 hover:bg-primary-300 cursor-pointer"
          >
            Login Sekarang
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
