"use client";

import Navbar from "../../components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../../firebaseConfig";
import { motion } from "framer-motion";

export default function Career() {
  const [careerPlan, setCareerPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCareerPlan() {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) return;

      try {
        // Fetch user skills from Firestore or local state (simplify here)
        // For demo, just send empty or dummy array
        const skills = ["JavaScript", "React"];

        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/career/roadmap`, {
          userId: user.uid,
          skills,
        });
        setCareerPlan(res.data);
      } catch {
        alert("Failed to fetch career roadmap");
      } finally {
        setLoading(false);
      }
    }
    fetchCareerPlan();
  }, []);

  return (
    <>
      <Navbar />
      <main className="pt-24 max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6">Career Roadmap</h1>
        {loading && <p>Loading...</p>}

        {careerPlan && (
          <>
            <section className="mb-6">
              <h2 className="font-semibold text-xl mb-2">Recommended Career Paths</h2>
              <ul className="list-disc pl-6 space-y-1">
                {(careerPlan.careerPaths || []).map((path, idx) => (
                  <li key={idx}>{path}</li>
                ))}
              </ul>
            </section>
            <section className="mb-6">
              <h2 className="font-semibold text-xl mb-2">Missing Skills</h2>
              <ul className="list-disc pl-6 space-y-1">
                {(careerPlan.missingSkills || []).map((skill, idx) => (
                  <li key={idx} className="text-red-600">
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="font-semibold text-xl mb-2">Personalized Roadmap</h2>
              <ol className="list-decimal pl-6 space-y-1">
                {(careerPlan.roadmap || []).map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </section>
          </>
        )}
      </main>
    </>
  );
}
