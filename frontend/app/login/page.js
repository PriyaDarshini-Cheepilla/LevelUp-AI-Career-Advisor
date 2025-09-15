"use client";

import { useState } from "react";
import { auth, googleProvider } from "../../firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  const handleEmailAuth = async () => {
    setError("");
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/dashboard");
    } catch (e) {
      setError(e.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <motion.div initial={{opacity:0, scale: 0.8}} animate={{opacity:1, scale:1}} transition={{duration: 0.7}} className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-indigo-900 via-purple-900 to-pink-900 px-4">
      <div className="max-w-md w-full bg-black bg-opacity-70 rounded-xl p-8 shadow-lg text-white">
        <h2 className="text-3xl font-semibold mb-6 text-center">{isRegister ? "Register" : "Login"}</h2>
        {error && <p className="p-3 bg-red-700 mb-4 rounded">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-gray-900 border border-gray-700"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 rounded bg-gray-900 border border-gray-700"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <button onClick={handleEmailAuth} className="w-full py-3 rounded bg-pink-600 hover:bg-pink-700 font-semibold transition">
          {isRegister ? "Register" : "Login"}
        </button>
        <p className="mt-4 text-center text-gray-300">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button className="underline hover:text-pink-400" onClick={() => { setIsRegister(!isRegister); setError(""); }}>
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
        <div className="my-6 border-t border-gray-700" />
        <button onClick={handleGoogleLogin} className="w-full py-3 rounded bg-blue-600 hover:bg-blue-700 flex justify-center items-center gap-2 font-semibold transition">
          Sign in with Google
        </button>
      </div>
    </motion.div>
  );
}
