import { notFound } from "next/navigation";
import Image from "next/image";

async function getAgroguideDetail(id: string) {
  const res = await fetch(`/api/agroguide/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function AgroguideDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getAgroguideDetail(params.id);
  if (!data) return notFound();

  const {
    title,
    description,
    content,
    thumbnail,
    createdAt,
    category,
    contentType,
    url,
  } = data;

  const date = new Date(createdAt);
  const formattedDate = date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-10">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Detail {contentType === "VIDEO" ? "Video" : "Artikel"}
        </h2>
        <table className="w-full border border-gray-200">
          <tbody>
            <tr>
              <td className="font-semibold p-2 border-b border-gray-100 w-1/3">
                Judul
              </td>
              <td className="p-2 border-b border-gray-100">{title}</td>
            </tr>
            <tr>
              <td className="font-semibold p-2 border-b border-gray-100">
                Deskripsi
              </td>
              <td className="p-2 border-b border-gray-100">{description}</td>
            </tr>
            {contentType === "ARTICLE" ? (
              <tr>
                <td className="font-semibold p-2 border-b border-gray-100">
                  Isi
                </td>
                <td className="p-2 border-b border-gray-100 whitespace-pre-line">
                  {content}
                </td>
              </tr>
            ) : (
              <tr>
                <td className="font-semibold p-2 border-b border-gray-100">
                  Video
                </td>
                <td className="p-2 border-b border-gray-100">
                  {url && url.includes("youtube") ? (
                    <iframe
                      width="320"
                      height="180"
                      src={url.replace("watch?v=", "embed/")}
                      title={title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded"
                    ></iframe>
                  ) : url && url.includes("vimeo") ? (
                    <iframe
                      src={url.replace("vimeo.com", "player.vimeo.com/video")}
                      width="320"
                      height="180"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title={title}
                      className="rounded"
                    ></iframe>
                  ) : url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Lihat Video
                    </a>
                  ) : (
                    <span className="text-gray-400">Tidak ada video</span>
                  )}
                </td>
              </tr>
            )}
            <tr>
              <td className="font-semibold p-2 border-b border-gray-100">
                Tanggal
              </td>
              <td className="p-2 border-b border-gray-100">{formattedDate}</td>
            </tr>
            <tr>
              <td className="font-semibold p-2 border-b border-gray-100">
                Kategori
              </td>
              <td className="p-2 border-b border-gray-100">
                {category?.name || "-"}
              </td>
            </tr>
            <tr>
              <td className="font-semibold p-2 border-b border-gray-100">
                Thumbnail
              </td>
              <td className="p-2 border-b border-gray-100">
                {thumbnail ? (
                  <Image
                    src={thumbnail}
                    alt={title}
                    width={120}
                    height={80}
                    className="rounded"
                  />
                ) : (
                  <span className="text-gray-400">Tidak ada gambar</span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="mt-8 flex justify-center">
          <a
            href="/agroguide/video"
            className="px-6 py-2 rounded-lg bg-[#355C4A] text-white font-semibold shadow hover:bg-[#274634] transition"
          >
            Kembali
          </a>
        </div>
      </div>
    </div>
  );
}
