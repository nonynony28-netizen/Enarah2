import { motion } from "framer-motion";

export default function SplashScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 3.8 }}
    >
      {/* Cinematic Spotlight Sweep */}
      <motion.div
        className="absolute w-[140%] h-[140%] pointer-events-none"
        initial={{ x: "120%" }}
        animate={{ x: "-30%" }}
        transition={{ duration: 1.6, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(700px circle at center, rgba(37,99,235,0.35), rgba(37,99,235,0.1) 40%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Electric Flicker (وميض خفيف) */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.15, 0.05, 0.2, 0.08, 0] }}
        transition={{ duration: 1.2, delay: 1.2 }}
        style={{ backgroundColor: "#2563eb" }}
      />

      {/* Logo */}
      <div className="relative">
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold text-blue-500 tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          style={{
            textShadow:
              "0 0 12px rgba(37,99,235,0.7), 0 0 30px rgba(37,99,235,0.4)",
          }}
        >
          الإنارة الحديثة
        </motion.h1>

        {/* Shine Sweep (لمعة تمر على النص) */}
        <motion.div
          className="absolute top-0 left-[-60%] w-[60%] h-full pointer-events-none"
          initial={{ left: "-60%" }}
          animate={{ left: "120%" }}
          transition={{
            duration: 1.8,
            delay: 1,
            ease: "easeInOut",
          }}
          style={{
            background:
              "linear-gradient(120deg, transparent, rgba(255,255,255,0.9), transparent)",
            filter: "blur(8px)",
          }}
        />
      </div>

      {/* Glow Behind */}
      <motion.div
        className="absolute w-[320px] h-[320px] rounded-full"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1.6, opacity: 0.25 }}
        transition={{ duration: 1.2, delay: 0.6 }}
        style={{
          background:
            "radial-gradient(circle, rgba(37,99,235,0.5), transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* Sub text */}
      <motion.p
        className="absolute bottom-20 text-white/30 text-xs md:text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        Lighting Your World
      </motion.p>
    </motion.div>
  );
}
