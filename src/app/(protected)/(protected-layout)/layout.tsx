import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { ReactNode } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: Readonly<ReactNode>;
}) {
  return (
    <div className="h-screen overflow-y-scroll bg-slate-50 text-slate-900 flex flex-col font-sans bg-layout-bg bg-cover bg-center bg-no-repeat">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
