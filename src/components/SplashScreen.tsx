import { motion } from "framer-motion";

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      
      {/* Background subtle light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,80,200,0.25),transparent_70%)]" />

      {/* Moving light sweep */}
      <motion.div
        className="absolute w-[300px] h-[100px] bg-white/20 blur-2xl"
        initial={{ x: -400, opacity: 0 }}
        animate={{ x: 400, opacity: [0, 1, 0] }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      />

      {/* Title */}
      <motion.h1
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.7, ease: "easeOut" }}
  className="text-3xl md:text-6xl font-extrabold text-blue-300 tracking-tight relative z-10"
  style={{
    textShadow: `
      0 0 10px rgba(59,130,246,0.6),
      0 0 25px rgba(59,130,246,0.4),
      0 0 60px rgba(0,120,255,0.25)
    `,
    WebkitTextStroke: "0.4px rgba(255,255,255,0.15)"
  }}
>
  الإنارة الحديثة
</motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="absolute bottom-20 text-gray-400 text-sm tracking-wide"
      >
        نضيء عالمك بأناقة
      </motion.p>
    </div>
  );
}
