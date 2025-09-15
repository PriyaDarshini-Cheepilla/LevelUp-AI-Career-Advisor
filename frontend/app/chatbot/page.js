"use client";

import Navbar from "../../components/Navbar";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { auth } from "../../firebaseConfig";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const containerRef = useRef(null);

  const user = auth.currentUser;

  // Load past messages is optional (gets chat collection from Firestore)
  // For simplicity, we start empty

  const sendMessage = async () => {
    if (!input.trim() || !user) return;

    const updatedMessages = [...messages, { role: "user", content: input }];
    setMessages(updatedMessages);
    setInput("");

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chatbot/message`, {
        userId: user.uid,
        messages: updatedMessages,
      });
      setMessages([...updatedMessages, { role: "assistant", content: res.data.reply }]);
      containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
    } catch {
      alert("Chatbot communication failed");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 max-w-4xl mx-auto p-6 flex flex-col h-[80vh]">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6">Career Mentor Chatbot</h1>
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto p-4 border rounded mb-4 bg-white"
          style={{ scrollbarWidth: "thin" }}
        >
          {messages.map(({ role, content }, idx) => (
            <div
              key={idx}
              className={`mb-3 p-3 rounded max-w-xl ${
                role === "user" ? "bg-pink-100 self-end text-right" : "bg-indigo-100"
              }`}
              style={{ alignSelf: role === "user" ? "flex-end" : "flex-start" }}
            >
              <pre className="whitespace-pre-wrap">{content}</pre>
            </div>
          ))}
        </div>
        <textarea
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask your career mentor..."
          className="p-3 border rounded resize-none"
        />
        <button
          onClick={sendMessage}
          className="mt-3 bg-pink-600 py-3 text-white rounded font-semibold hover:bg-pink-700 transition"
        >
          Send
        </button>
      </main>
    </>
  );
}
