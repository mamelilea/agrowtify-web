import { Button } from "@/components/ui/button";
import React from "react";

export default function HeroSection() {
  return (
    <div className="pt-20 bg-gradient-to-b from-primary to-white h-full min-h-screen flex items-center justify-center w-full">
      <div className="w-full flex items-center justify-center h-full">
        <div className="w-1/2 h-full flex justify-end text-primary-500">
          <div className="space-y-7 w-[90%]">
            <h1 className="text-5xl font-platypi font-extrabold w-[90%]">
              Transformasi Pertanian bersama Teknologi Digital
            </h1>
            <h2 className="text-2xl text-justify font-comme">
              <b>Agrowtify</b> hadir untuk menemani perjalanan pertanian anda.
              Jadikan setiap langkah anda di lahan lebih terarah, terukur, dan
              berdaya guna!
            </h2>
            <Button
              variant="outline"
              className="font-comme text-lg mt-10 font-bold"
            >
              Pelajari lebih lanjut
            </Button>
          </div>
        </div>
        <div className=" w-1/2 h-full flex items-end justify-end ">
          <img src="/assets/images/home/people.png" alt="people" />
        </div>
      </div>
    </div>
  );
}
