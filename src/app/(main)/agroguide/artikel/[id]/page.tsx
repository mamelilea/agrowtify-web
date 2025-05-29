import React from "react";
import {
  ArrowLeft,
  Calendar,
  Tag,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

const AgroguideDetailComponent = () => {
  const data = {
    title: "Kenali Jenis Tanahmu!",
    description:
      "Tips mengidentifikasi jenis tanah dan cara memperbaiki struktur tanah agar tanaman tumbuh subur.",
    content:
      "Tanah merupakan media tumbuh yang sangat penting bagi tanaman. Setiap jenis tanah memiliki karakteristik yang berbeda-beda. Untuk mendapatkan hasil panen yang optimal, penting bagi petani untuk mengenali jenis tanah di lahan mereka.\n\nBeberapa jenis tanah yang umum ditemukan antara lain:\n1. Tanah liat - memiliki kemampuan menahan air yang baik\n2. Tanah pasir - drainase baik namun mudah kekeringan\n3. Tanah humus - kaya akan bahan organik\n\nDengan mengenali karakteristik tanah, petani dapat menentukan jenis tanaman yang cocok dan cara pengelolaan yang tepat.",
    thumbnail: "/api/placeholder/400/300",
    createdAt: "2021-10-29T00:00:00Z",
    category: { name: "Pertanian Organik" },
  };

  const date = new Date(data.createdAt);
  const formattedDate = date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="relative">
              <div className="w-80 h-80 rounded-full overflow-hidden border-8 border-white/20 shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-green-200 to-emerald-300 flex items-center justify-center">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "linear-gradient(45deg, #10b981, #059669)",
                      backgroundBlendMode: "overlay",
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-white/80 text-center">
                        <ImageIcon size={48} className="mx-auto mb-2" />
                        <p className="text-sm">Gambar Artikel</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400/30 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-400/20 rounded-full blur-xl"></div>
            </div>

            <div className="flex-1 text-white">
              <div className="flex items-center gap-2 text-green-100 mb-4">
                <Calendar size={16} />
                <span className="text-sm font-medium">{formattedDate}</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {data.title}
              </h1>
              <p className="text-xl text-green-100 leading-relaxed mb-8">
                {data.description}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Tag size={16} />
                  <span className="text-sm font-medium">
                    {data.category?.name || "Umum"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6">
              <div className="flex items-center gap-3 text-white">
                <FileText size={24} />
                <h2 className="text-2xl font-bold">Isi Artikel</h2>
              </div>
            </div>
            <div className="p-8">
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {data.content}
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-emerald-500">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="text-emerald-600" size={20} />
                <h3 className="font-semibold text-gray-800">
                  Tanggal Publikasi
                </h3>
              </div>
              <p className="text-gray-600">{formattedDate}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-teal-500">
              <div className="flex items-center gap-3 mb-3">
                <Tag className="text-teal-600" size={20} />
                <h3 className="font-semibold text-gray-800">Kategori</h3>
              </div>
              <p className="text-gray-600">
                {data.category?.name || "Tidak ada kategori"}
              </p>
            </div>
          </div>

          <div className="text-center">
            <button className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105">
              <ArrowLeft size={20} />
              Kembali ke Daftar Artikel
            </button>
          </div>
        </div>
      </div>

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-10 w-64 h-64 bg-gradient-to-br from-green-200/30 to-emerald-300/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-10 w-48 h-48 bg-gradient-to-br from-teal-200/30 to-cyan-300/30 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default AgroguideDetailComponent;
