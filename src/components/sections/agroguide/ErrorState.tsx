import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";

interface ErrorStateProps {
  onRetry: () => void;
  contentType: "ARTICLE" | "VIDEO";
}

export default function ErrorState({ onRetry, contentType }: ErrorStateProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-20">
      <div className="max-w-md w-full mx-auto text-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-platypi font-bold text-gray-800 mb-2">
              Oops! Terjadi Gangguan
            </h3>
            <p className="text-gray-600 mb-6">
              Maaf, kami sedang mengalami kesulitan untuk memuat{" "}
              {contentType === "VIDEO" ? "video" : "artikel"}. Tim kami sedang
              bekerja untuk memperbaiki masalah ini.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={onRetry}
              className="w-full bg-primary-400 hover:bg-primary-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
            >
              <RefreshCw className="w-5 h-5" />
              Coba Muat Ulang
            </Button>
            <p className="text-sm text-gray-500">
              Jika masalah berlanjut, silakan coba beberapa saat lagi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
