"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { auth } from "../../firebaseConfig";

export default function Upload() {
  const [resumeText, setResumeText] = useState("");
  const [parsed, setParsed] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleParse = async () => {
    if (!resumeText) return alert("Please paste your resume text");

    setLoading(true);
    const user = auth.currentUser;
    if (!user) return alert("Not authenticated");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/resume/parse`,
        { resumeText, userId: user.uid }
      );
      setParsed(res.data);
    } catch (e) {
      alert("Failed to parse resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 max-w-4xl mx-auto px-4 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-indigo-900">Upload Resume</h1>
        <textarea
          rows={15}
          className="w-full p-4 border rounded shadow-md"
          placeholder="Paste your resume text here..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
        />
        <button
          onClick={handleParse}
          disabled={loading}
          className="bg-pink-600 text-white py-3 rounded font-semibold disabled:opacity-50"
        >
          {loading ? "Parsing..." : "Parse Resume"}
        </button>
        {parsed && (
          <div className="bg-white rounded p-4 shadow mt-4">
            <h2 className="font-semibold mb-2">Extracted Data:</h2>
            <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(parsed, null, 2)}</pre>
          </div>
        )}
      </main>
    </>
  );
}
