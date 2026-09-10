import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Layout() {
  return (
    <div className="relative min-h-screen text-slate-900 bg-[#f8fafc]">
      {/* الخلفية المعمارية البيضاء النظيفة الفاخرة (Clean White Architectural Background) */}
      <div className="fixed inset-0 -z-50 w-full h-full bg-[#f8fafc] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#ffffff] via-[#f8fafc] to-[#f1f5f9]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c708_1px,transparent_1px),linear-gradient(to_bottom,#0284c708_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      <Navbar />
      <div className="relative z-10 w-full">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
