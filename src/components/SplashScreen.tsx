import { motion } from "framer-motion";

export default function SplashScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 3 }}
    >
      {/* النص */}
      <div className="relative">
        <h1 className="text-4xl md:text-6xl font-extrabold text-blue-600 tracking-wide">
          الإنارة الحديثة
        </h1>

        {/* اللمعة المتحركة */}
        <motion.div
          className="absolute top-0 left-[-60%] w-[60%] h-full pointer-events-none"
          initial={{ left: "-60%" }}
          animate={{ left: "120%" }}
          transition={{
            duration: 1.6,
            ease: "easeInOut",
            delay: 0.5,
          }}
          style={{
            background:
              "linear-gradient(120deg, transparent, rgba(255,255,255,0.8), transparent)",
            filter: "blur(6px)",
          }}
        />
      </div>

      {/* توهج خفيف خلف النص */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ delay: 0.5 }}
        style={{
          background:
            "radial-gradient(circle, rgba(37,99,235,0.4), transparent 70%)",
          filter: "blur(50px)",
        }}
      />
    </motion.div>
  );
}
