import React, { useState } from "react";
import { Search } from "lucide-react";

export default function HeroSection() {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <div className="w-full relative">
        <img
          src="/assets/images/agroevent/bg-hero.png"
          alt="Background"
          className="w-full h-auto block z-0"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white z-10"></div>

        <div className="absolute inset-0 z-20 flex flex-col items-center pt-50">
          <div className="w-[90%] flex items-center justify-center">
            <div className="w-7/12 font-platypi text-white space-y-3 mt-20">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">Agrovent</h1>
              <h2 className="text-xl">
                Informasi event terbaru seputar dunia pertanian mulai dari
                seminar, pelatihan, hingga workshop. Jangan lewatkan kesempatan
                untuk merawat tanaman anda!
              </h2>
              <div className="">
                <div className="relative max-w-2xl">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Pencarian..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2  focus:border-transparent text-black shadow-lg bg-white"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
            </div>
            <div className="w-5/12"></div>
          </div>
        </div>
      </div>
    </>
  );
}
