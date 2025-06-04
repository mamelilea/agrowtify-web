"use client";

import ContentEvent from "@/components/sections/agroevent/ContentEvent";
import HeroSection from "@/components/sections/agroevent/HeroSection";
import React, { useState } from "react";

export default function Agroevent() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="bg-white">
      <HeroSection onSearch={handleSearch} />
      <ContentEvent searchTerm={searchTerm} />
    </div>
  );
}
