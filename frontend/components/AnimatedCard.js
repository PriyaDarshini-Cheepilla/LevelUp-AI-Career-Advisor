"use client";

import { motion } from "framer-motion";

export default function AnimatedCard({ children, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.07, y: -8 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onClick={onClick}
      className="rounded-xl p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg cursor-pointer select-none"
    >
      {children}
    </motion.div>
  );
}
