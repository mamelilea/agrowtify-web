import Footer from "@/components/layouts/Footer";
import Navbar from "@/components/layouts/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="mx-auto">{children}</main>
      <Footer />
    </>
  );
}
