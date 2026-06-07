import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Layout() {
  return (
    <div className="relative min-h-screen text-white">
      {/* الخلفية الإبداعية فائقة الأداء والمتحركة ببطء */}
      <div className="fixed inset-0 -z-50 w-full h-full bg-[#050b14] overflow-hidden pointer-events-none">
        {/* التدرج اللوني الذي يتحرك ببطء */}
        <div className="absolute -inset-[50%] w-[200%] h-[200%] bg-ultra-ambient animate-slow-rotate opacity-90"></div>
        {/* الشبكة الهندسية الفاخرة */}
        <div className="absolute inset-0 bg-animated-grid opacity-[0.06]"></div>
        {/* طبقة تظليل داكنة ناعمة لضمان سهولة قراءة النصوص */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050b14]/30 via-transparent to-[#050b14]/60"></div>
      </div>

      <Navbar />
      <div className="relative z-10 w-full">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
