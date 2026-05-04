import { motion } from "framer-motion";

export default function SplashScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[#020617] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 3 }}
    >
      {/* ضوء متحرك */}
      <motion.div
        className="absolute w-[120%] h-[120%]"
        initial={{ x: "100%" }}
        animate={{ x: "-20%" }}
        transition={{ duration: 1.2 }}
        style={{
          background:
            "radial-gradient(600px circle at center, rgba(250,204,21,0.3), transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* الشعار */}
      <motion.h1
        className="text-4xl md:text-6xl font-bold text-yellow-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        الإنارة الحديثة
      </motion.h1>
    </motion.div>
  );
}
