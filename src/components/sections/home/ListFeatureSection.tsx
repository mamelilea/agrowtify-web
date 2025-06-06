import React from "react";

export default function ListFeatureSection() {
  return (
    <div className="bg-white h-full min-h-screen flex items-center justify-center w-full py-20">
      <div className="w-[80%] space-y-5 flex flex-col items-center">
        <h1 className="text-5xl font-platypi font-extrabold text-primary-500 text-center">
          Dapatkan dukungan perawatan tanaman dan lahan anda melalui fitur kami
        </h1>
        <h6 className="font-medium text-center">
          Agrowtify menghadirkan fitur Agrowguide, Agrowevent, dan Agrowcare
        </h6>
        <div className="grid grid-cols-2 gap-5 max-w-4xl">
          <img src="/assets/images/home/card-journaling.png" alt="card" />
          <img src="/assets/images/home/card-event.png" alt="card" />
          <img src="/assets/images/home/card-videoartikel.png" alt="card" />
          <img src="/assets/images/home/card-cuaca.png" alt="card" />
        </div>
      </div>
    </div>
  );
}
