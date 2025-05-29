// app/agroguide/video/page.tsx
import { Suspense } from "react";
import ContentVideo from "@/components/sections/agroguide/video/ContentVideo";
import { getCategories } from "@/lib/api/categories";

export default async function AgroguideVideoPage() {
  // Fetch categories at page level (server-side)
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen">
            Loading...
          </div>
        }
      >
        <ContentVideo categories={categories} />
      </Suspense>
    </div>
  );
}
