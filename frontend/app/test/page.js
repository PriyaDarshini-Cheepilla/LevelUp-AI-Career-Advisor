"use client";

import Navbar from "../../components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../../firebaseConfig";
import { motion } from "framer-motion";
import RadarChart from "../../components/RadarChart";

export default function Test() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    setLoading(true);
    const user = auth.currentUser;
    if (!user) return;

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/test/generate`, { userId: user.uid });
      setQuestions(res.data.questions);
      setAnswers({});
      setScore(null);
    } catch {
      alert("Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  }

  const handleAnswerChange = (qIdx, value) => {
    setAnswers((prev) => ({ ...prev, [qIdx]: value }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      return alert("Please answer all questions");
    }
    setLoading(true);
    const user = auth.currentUser;
    if (!user) return;

    try {
      const answerArray = questions.map((_, idx) => ({ questionId: idx, answer: answers[idx] }));
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/test/evaluate`, { userId: user.uid, answers: answerArray });
      setScore(res.data.score);
    } catch {
      alert("Failed to evaluate test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6">Skill Test</h1>
        {loading && <p>Loading...</p>}

        {questions.length > 0 && (
          <form>
            {questions.map((q, idx) => (
              <div key={idx} className="mb-6">
                <p className="font-semibold">{idx + 1}. {q.question}</p>
                <div className="flex flex-col mt-2 space-y-2">
                  {q.options.map((opt, i) => (
                    <label key={i} className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`q${idx}`}
                        value={opt}
                        checked={answers[idx] === opt}
                        onChange={() => handleAnswerChange(idx, opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-pink-600 text-white py-3 px-6 rounded font-semibold hover:bg-pink-700 transition"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={fetchQuestions}
              disabled={loading}
              className="ml-4 bg-indigo-600 text-white py-3 px-6 rounded font-semibold hover:bg-indigo-700 transition"
            >
              Restart Test
            </button>
          </form>
        )}

        {score !== null && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Your Score: {score} / {questions.length}</h3>
            {/* RadarChart can be extended to visualize skill-wise scores */}
            <RadarChart testResults={{ Score: score }} />
          </div>
        )}
      </main>
    </>
  );
}
