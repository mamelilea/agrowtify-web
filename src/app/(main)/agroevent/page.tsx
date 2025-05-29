"use client";

import ContentEvent from "@/components/sections/agroevent/ContentEvent";
import HeroSection from "@/components/sections/agroevent/HeroSection";
import React from "react";

export default function Agroevent() {
  return (
    <div className="bg-white">
      <HeroSection />
      <ContentEvent />
    </div>
  );
}
