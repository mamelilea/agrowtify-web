import React from "react";
import Image from "next/image";

interface Testimonial {
  id: string;
  rating: number;
  quote: string;
  name: string;
  occupation: string;
  imageUrl: string;
}

const sampleTestimonials: Testimonial[] = [
  {
    id: "1",
    rating: 5,
    quote:
      "Saya sangat terbantu oleh website ini. Informasi nya banyak desainnya juga simple jadi mudah dipahami bagi saya yang tidak terlalu paham teknologi.",
    name: "Karjo",
    occupation: "Petani",
    imageUrl: "https://ik.imagekit.io/e7kqyoong/Intersect.png?updatedAt=1749106317540",
  },
  {
    id: "2",
    rating: 5,
    quote:
      "Tampilan website menarik dan mudah digunakan, saya suka fitur-fitur yang ada membantu tugas perkuliahan saya.",
    name: "Reza",
    occupation: "Mahasiswa Pertanian",
    imageUrl: "https://ik.imagekit.io/e7kqyoong/Intersect.png?updatedAt=1749106317540",
  },
  {
    id: "3",
    rating: 4,
    quote:
      "Informasi yang diberikan cukup lengkap, fitur cuaca harian cukup akurat dan bagus untuk yang ingin belajar dan memulai di bidang pertanian seperti saya",
    name: "Jono",
    occupation: "Karyawan",
    imageUrl: "https://ik.imagekit.io/e7kqyoong/Intersect.png?updatedAt=1749106317540",
  },
  {
    id: "4",
    rating: 5,
    quote:
      "Saya menemukan banyak artikel berguna tentang pertanian dan fitur journaling nya sangat bermanfaat untuk petani!",
    name: "Suptrapto",
    occupation: "Petani",
    imageUrl: "https://ik.imagekit.io/e7kqyoong/Intersect.png?updatedAt=1749106317540",
  },
];

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      stars.push(
        <svg
          key={i}
          className="w-5 h-5 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
        </svg>,
      );
    } else {
      stars.push(
        <svg
          key={i}
          className="w-5 h-5 text-gray-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
        </svg>,
      );
    }
  }
  return <div className="flex">{stars}</div>;
};

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({
  testimonial,
}) => (
  <div className="bg-primary-400 text-white rounded-lg shadow-md p-6 flex flex-col h-full">
    {" "}
    <div className="flex items-center mb-4">
      {renderStars(testimonial.rating)}
    </div>
    <p className="text-white/80 text-base mb-6 flex-grow line-clamp-5">{testimonial.quote}</p>
    <div className="flex items-center mt-auto">
      {" "}
      <Image
        src={testimonial.imageUrl}
        alt={testimonial.name}
        width={56}
        height={56}
        className="rounded-full object-cover mr-4"
      />
      <div>
        <h4 className="text-lg font-semibold">{testimonial.name}</h4>
        <p className="text-white/60 text-sm">{testimonial.occupation}</p>
      </div>
    </div>
  </div>
);

export default function TestimonialSection() {
  return (
    <div className="bg-primary-100 w-full py-20">
      {" "}
      <div className="w-[80%] mx-auto space-y-12">
        <h2 className="text-5xl font-platypi font-extrabold text-center text-white">
          {" "}
          Apa kata mereka tentang Agrowtify?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sampleTestimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </div>
  );
}
