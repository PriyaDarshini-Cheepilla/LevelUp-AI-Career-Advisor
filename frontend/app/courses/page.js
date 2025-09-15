"use client";

import Navbar from "../../components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../../firebaseConfig";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [missingSkills, setMissingSkills] = useState(["JavaScript", "React"]);

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) return;

      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/courses/recommend`, {
          userId: user.uid,
          missingSkills,
        });
        setCourses(res.data);
      } catch {
        alert("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  return (
    <>
      <Navbar />
      <main className="pt-24 max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6">Recommended Free Courses</h1>
        {loading && <p>Loading...</p>}
        {courses.length > 0 ? (
          <ul className="space-y-4">
            {courses.map((course, idx) => (
              <li key={idx} className="border p-4 rounded shadow hover:shadow-lg transition">
                <a href={course.url} target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold">
                  {course.title}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No course recommendations available currently.</p>
        )}
      </main>
    </>
  );
}
