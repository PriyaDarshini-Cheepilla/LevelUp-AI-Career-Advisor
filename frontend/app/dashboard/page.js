"use client";

import Navbar from "../../components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <main className="pt-28 max-w-7xl mx-auto px-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <h1 className="col-span-full text-center text-4xl font-extrabold text-indigo-900 mb-8">Welcome to LevelUp</h1>
        {[
          { name: "Upload Resume", href: "/upload", color: "bg-purple-600" },
          { name: "Career Path", href: "/career", color: "bg-pink-600" },
          { name: "Skill Test", href: "/test", color: "bg-indigo-600" },
          { name: "Courses", href: "/courses", color: "bg-purple-700" },
          { name: "Jobs", href: "/jobs", color: "bg-pink-700" },
          { name: "Chatbot", href: "/chatbot", color: "bg-indigo-700" },
        ].map(({ name, href, color }) => (
          <motion.div
            key={name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${color} text-white rounded-xl p-6 shadow-lg cursor-pointer flex items-center justify-center text-xl font-semibold`}
          >
            <Link href={href}>{name}</Link>
          </motion.div>
        ))}
      </main>
    </>
  );
}
