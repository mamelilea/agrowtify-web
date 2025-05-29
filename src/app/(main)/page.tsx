"use client";

import React from "react";
import HeroSection from "@/components/sections/home/HeroSection";
import AboutSection from "@/components/sections/home/AboutSection";
import ListFeatureSection from "@/components/sections/home/ListFeatureSection";
import AgroguidePreviewSection from "@/components/sections/home/AgroguidePreviewSection";
import AgroweventPreviewSection from "@/components/sections/home/AgroweventPreviewSection";
import TestimonialSection from "@/components/sections/home/TestimonialSection";

export default function HomePage() {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <HeroSection />
      <AboutSection />
      <ListFeatureSection />
      <AgroguidePreviewSection />
      <AgroweventPreviewSection />
      <TestimonialSection />
    </div>
  );
}
