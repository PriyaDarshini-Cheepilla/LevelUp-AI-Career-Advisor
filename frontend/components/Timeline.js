"use client";
import { motion } from "framer-motion";

export default function Timeline({ roadmap }) {
  return (
    <div className="max-w-3xl mx-auto my-12 space-y-8">
      {roadmap.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.2 }}
          className="bg-white p-6 rounded-xl shadow-lg border-l-8 border-purple-600"
        >
          <h3 className="text-lg font-bold mb-2">{step.title}</h3>
          <p className="text-gray-700">{step.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
