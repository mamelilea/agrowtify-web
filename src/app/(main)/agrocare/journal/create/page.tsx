// src/app/(main)/agrocare/journal/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function CreateJournalPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    kondisiTanaman: "",
    aktivitasHariIni: "",
    perubahanTercatat: "",
    catatanTambahan: "",
    fotoTanaman: null as File | null,
    title: null as string | null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFormData((prev) => ({
      ...prev,
      fotoTanaman: file || null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validasi kondisi tanaman (required)
    if (!formData.kondisiTanaman.trim()) {
      setError("Mohon isi kondisi tanaman Anda hari ini.");
      setLoading(false);
      return;
    }

    const submitFormData = new FormData();

    // Generate title jika tidak ada
    const title =
      formData.title ||
      `Journal ${new Date().toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`;
    submitFormData.append("title", title);

    // Append semua jawaban
    submitFormData.append("kondisiTanaman", formData.kondisiTanaman);
    if (formData.aktivitasHariIni.trim()) {
      submitFormData.append("aktivitasHariIni", formData.aktivitasHariIni);
    }
    if (formData.perubahanTercatat.trim()) {
      submitFormData.append("perubahanTercatat", formData.perubahanTercatat);
    }
    if (formData.catatanTambahan.trim()) {
      submitFormData.append("catatanTambahan", formData.catatanTambahan);
    }

    // Append foto jika ada
    if (formData.fotoTanaman) {
      submitFormData.append("media", formData.fotoTanaman);
    }

    try {
      const response = await fetch("/api/agrocare/journal/entries", {
        method: "POST",
        body: submitFormData,
      });

      if (response.status === 401) {
        setError("Anda tidak memiliki izin untuk melakukan tindakan ini.");
        return;
      }

      if (!response.ok) {
        throw new Error(`Gagal menyimpan journal: ${response.status}`);
      }

      alert("Journal berhasil disimpan!");
      router.push("/agrocare/journal");
    } catch (error: unknown) {
      console.error("Error submitting journal:", error);
      setError("Terjadi kesalahan saat menyimpan journal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen py-40 px-4"
      style={{
        backgroundImage: `url('/assets/images/journaling/bg-Journaling.png')`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top",
        backgroundSize: "100% auto",
        width: "100%",
      }}
    >
      <div className="max-w-2xl mx-auto pt-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/agrocare/journal")}
          className="flex items-center gap-2 text-white hover:underline mb-8 focus:outline-none"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Buat journal anda hari ini!
          </h1>
        </div>

        {/* Form Steps */}
        <form onSubmit={handleSubmit} className="relative">
          {/* Vertical Line */}
          <div className="absolute left-6 top-12 bottom-12 w-1 bg-primary-300"></div>

          <div className="space-y-16">
            {/* Step 1 - Required */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-300 rounded-full flex items-center justify-center text-white font-bold text-xl relative z-10">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-3 text-black">
                  Bagaimana kondisi tanaman Anda hari ini?{" "}
                  <span className="text-red-500">*</span>
                </h3>
                <textarea
                  value={formData.kondisiTanaman}
                  onChange={(e) =>
                    handleInputChange("kondisiTanaman", e.target.value)
                  }
                  placeholder="Berikan jawaban anda....."
                  className="w-full p-4 rounded-lg border border-gray-200 bg-white/90 backdrop-blur-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-green-300 placeholder-gray-500"
                  required
                />
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-300 rounded-full flex items-center justify-center text-white font-bold text-xl relative z-10">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-3 text-black">
                  Apa yang Anda lakukan hari ini untuk merawat tanaman?
                </h3>
                <textarea
                  value={formData.aktivitasHariIni}
                  onChange={(e) =>
                    handleInputChange("aktivitasHariIni", e.target.value)
                  }
                  placeholder="Berikan jawaban anda....."
                  className="w-full p-4 rounded-lg border border-gray-200 bg-white/90 backdrop-blur-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-green-300 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-300 rounded-full flex items-center justify-center text-white font-bold text-xl relative z-10">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-3 text-black">
                  Adakah perubahan yang Anda perhatikan sejak terakhir kali
                  mencatat jurnal?
                </h3>
                <textarea
                  value={formData.perubahanTercatat}
                  onChange={(e) =>
                    handleInputChange("perubahanTercatat", e.target.value)
                  }
                  placeholder="Berikan jawaban anda....."
                  className="w-full p-4 rounded-lg border border-gray-200 bg-white/90 backdrop-blur-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-green-300 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Step 4 - Catatan Tambahan */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-300 rounded-full flex items-center justify-center text-white font-bold text-xl relative z-10">
                4
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-3 text-black">
                  Catatan atau observasi tambahan lainnya?
                </h3>
                <textarea
                  value={formData.catatanTambahan}
                  onChange={(e) =>
                    handleInputChange("catatanTambahan", e.target.value)
                  }
                  placeholder="Berikan jawaban anda....."
                  className="w-full p-4 rounded-lg border border-gray-200 bg-white/90 backdrop-blur-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-green-300 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Step 5 - Upload Foto */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-300 rounded-full flex items-center justify-center text-white font-bold text-xl relative z-10">
                5
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-3 text-black">
                  Masukkan foto tanaman anda!
                </h3>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="flex items-center justify-center gap-3 w-full p-4 bg-primary-200 hover:bg-primary-400 text-white rounded-lg cursor-pointer transition-colors duration-200"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="font-medium">
                      {formData.fotoTanaman
                        ? formData.fotoTanaman.name
                        : "Masukkan Foto Tanaman"}
                    </span>
                  </label>
                </div>
                {formData.fotoTanaman && (
                  <div className="mt-4 relative w-32 h-32 rounded-lg overflow-hidden mx-auto">
                    <Image
                      src={URL.createObjectURL(formData.fotoTanaman)}
                      alt="Preview Foto Tanaman"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Step 6 - Submit */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-300 rounded-full flex items-center justify-center text-white font-bold text-xl relative z-10">
                6
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-3 text-black">
                  Apakah anda yakin menyimpan journal ini?
                </h3>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full p-4 bg-primary-200 hover:bg-primary-400 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors duration-200 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? "Menyimpan..." : "Simpan Journal"}
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </form>

        {/* Bottom Spacing */}
        <div className="h-12"></div>
      </div>
    </div>
  );
}
