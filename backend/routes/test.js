module.exports = (openai, db) => {
  const express = require("express");
  const router = express.Router();

  // Generate new random skill test questions using GPT-4o-mini
  router.post("/generate", async (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId required" });

    const systemPrompt = "Generate 5 unique multiple choice questions to test skills based on common career fields.";
    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: systemPrompt }],
        temperature: 0.85,
        max_tokens: 600,
      });

      let questionsRaw = completion.data.choices[0].message.content;
      // Expect response JSON array with questions [{ question: '', options: [], answer: '' }]
      let questions;
      try {
        questions = JSON.parse(questionsRaw);
      } catch {
        // fallback simple questions if parse fails
        questions = [
          {
            question: "What does HTML stand for?",
            options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "Hyperlinking Text Marking Language"],
            answer: "Hyper Text Markup Language",
          },
        ];
      }

      // Save generated questions for the user attempt for evaluation later
      await db.collection("users").doc(userId).set({ latestTest: questions, testAttemptedAt: new Date() }, { merge: true });
      res.json({ questions });
    } catch {
      res.status(500).json({ error: "Failed to generate questions" });
    }
  });

  // Evaluate answers
  router.post("/evaluate", async (req, res) => {
    const { userId, answers } = req.body; // answers: [{ questionId: 1, answer: '...'}]
    if (!userId || !answers) return res.status(400).json({ error: "userId and answers required" });

    try {
      const userDoc = await db.collection("users").doc(userId).get();
      if (!userDoc.exists) {
        return res.status(404).json({ error: "User not found" });
      }
      const latestTest = userDoc.data().latestTest;
      if (!latestTest) return res.status(404).json({ error: "No test found to evaluate" });

      let score = 0;
      answers.forEach((ans, idx) => {
        if (latestTest[idx] && ans.answer === latestTest[idx].answer) {
          score++;
        }
      });

      await db.collection("users").doc(userId).set({ lastTestScore: score, lastTestDate: new Date() }, { merge: true });

      res.json({ score, total: latestTest.length });
    } catch {
      res.status(500).json({ error: "Error evaluating test" });
    }
  });

  return router;
};
