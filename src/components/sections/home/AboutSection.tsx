export default function AboutSection() {
  return (
    <div
      className="w-full"
      style={{
        backgroundImage: `url('/assets/images/home/bg-AboutHome.png')`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center", // Pastikan menampilkan bagian bawah gambar
        backgroundSize: "100% auto", // Gunakan lebar 100% dengan tinggi proporsional
        minHeight: "800px", // Tetapkan tinggi minimum yang lebih spesifik
        width: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "visible", // Pastikan tidak ada yang dipotong
      }}
    >
      <div className="flex items-center justify-center py-64 w-full">
        <div className="w-1/2 h-full flex justify-end text-white pt-10">
          <div className="w-[90%] space-y-7 text-2xl font-comme">
            <h1 className="text-5xl font-platypi font-extrabold text-white">
              Apa itu Agrowtify
            </h1>
            <h2>
              <b>Agrowtify</b> menyediakan dukungan bagi para petani dalam
              merawat lahan melalui fitur-fitur unggulan:
            </h2>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <span className="mt-2">
                  <img src="/assets/icons/home/daun-home.png" alt="" />
                </span>
                <p>
                  Agrowguide menyediakan konten edukasi bagi para petani seputar
                  perawatan tanaman dan lahan.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2">
                  <img src="/assets/icons/home/daun-home.png" alt="" />
                </span>
                <p>
                  Agrowvent memberikan informasi event seputar perawatan tanaman
                  dan lahan.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2">
                  <img src="/assets/icons/home/daun-home.png" alt="" />
                </span>
                <p>
                  Agrowcare menghadirkan layanan untuk mendukung kesehatan
                  tanaman dan kesuburan lahan.
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-1/2"></div>
      </div>
    </div>
  );
}
