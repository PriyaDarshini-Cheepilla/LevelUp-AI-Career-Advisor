"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  if (!user) return null;

  const logout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full flex justify-between items-center bg-gradient-to-r from-purple-700 to-pink-700 p-4 text-white shadow-lg z-50"
    >
      <Link href="/dashboard" className="font-extrabold text-2xl">
        LevelUp
      </Link>
      <div className="flex gap-6 items-center">
        <Link href="/upload" className="hover:underline">
          Upload
        </Link>
        <Link href="/career" className="hover:underline">
          Career Path
        </Link>
        <Link href="/test" className="hover:underline">
          Skill Test
        </Link>
        <Link href="/courses" className="hover:underline">
          Courses
        </Link>
        <Link href="/jobs" className="hover:underline">
          Jobs
        </Link>
        <Link href="/chatbot" className="hover:underline">
          Chatbot
        </Link>
        <button onClick={logout} className="bg-pink-800 px-3 py-1 rounded hover:bg-pink-900 transition">
          Logout
        </button>
      </div>
    </motion.nav>
  );
}
