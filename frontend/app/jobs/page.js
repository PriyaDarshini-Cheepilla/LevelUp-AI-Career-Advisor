"use client";

import Navbar from "../../components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../../firebaseConfig";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [careerPreference, setCareerPreference] = useState("Software Engineer");
  const [skills, setSkills] = useState(["JavaScript", "React"]);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) return;

      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/jobs/match`, {
          userId: user.uid,
          skills,
          careerPreference,
        });
        setJobs(res.data);
      } catch {
        alert("Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, [careerPreference]);

  return (
    <>
      <Navbar />
      <main className="pt-24 max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6">Dream Jobs</h1>

        <div className="mb-4">
          <label className="block mb-2 font-semibold text-indigo-900" htmlFor="pref">
            Career Preference:
          </label>
          <input
            id="pref"
            value={careerPreference}
            onChange={(e) => setCareerPreference(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {loading && <p>Loading...</p>}

        {jobs.length > 0 ? (
          <ul className="space-y-4">
            {jobs.map(({ title, company, eligibility, applyLink }, idx) => (
              <li
                key={idx}
                className="border rounded p-4 shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold">{title} at {company}</h3>
                <p className="my-2">{eligibility}</p>
                <a
                  href={applyLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-pink-600 underline font-semibold"
                >
                  Apply Now
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No job matches found.</p>
        )}
      </main>
    </>
  );
}
