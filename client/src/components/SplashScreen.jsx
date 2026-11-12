import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HISABKITAB_LOGO } from "../utils/logo-data";

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500); // 2.5 seconds splash
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div 
      className="fixed inset-0 flex flex-col items-center justify-center select-none"
      style={{ backgroundColor: "#FFFFFF", zIndex: 99999 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center mb-8"
      >
        <img 
          src={HISABKITAB_LOGO} 
          alt="HisabKitab Logo" 
          className="w-28 h-28 md:w-36 md:h-36 object-contain mb-4"
          style={{ display: "block" }} 
        />
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Hisab<span className="text-[#00C58D]">Kitab</span>
        </h1>
        <p className="text-xs text-slate-500 font-medium tracking-wider uppercase mt-1">
          Smart Expense Tracker
        </p>
      </motion.div>
      
      {/* Line Loading Animation */}
      <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden relative">
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
