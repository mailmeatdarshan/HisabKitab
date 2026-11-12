import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500); // 2.5 seconds splash
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-[#121214] z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8"
      >
        <img src="/expenses.png" alt="HisabKitab Logo" className="w-32 h-32 md:w-48 md:h-48 object-contain" />
      </motion.div>
      
      {/* Line Loading Animation */}
      <div className="w-48 h-1 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden relative">
        <motion.div
          className="h-full bg-[#00C58D]"
          initial={{ width: "0%", left: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export default SplashScreen;
