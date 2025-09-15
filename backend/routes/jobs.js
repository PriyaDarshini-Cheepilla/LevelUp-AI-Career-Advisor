module.exports = (openai, db) => {
  const express = require("express");
  const router = express.Router();

  // Simulate job matching based on career path and skills
  router.post("/match", async (req, res) => {
    const { userId, skills, careerPreference } = req.body;
    if (!userId || !skills || !careerPreference) {
      return res.status(400).json({ error: "userId, skills and careerPreference required" });
    }

    try {
      const systemPrompt = "You are a job matching AI. Given user skills and career preferences, find 5 matched jobs at tech companies with eligibility and apply link.";
      const userPrompt = `User skills: ${skills.join(", ")}; Career preference: ${careerPreference}. Provide JSON with jobs array: [{title, company, eligibility, applyLink}].`;

      const completion = await openai.createChatCompletion({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
        temperature: 0.7,
      });

      let jobs;
      try {
        jobs = JSON.parse(completion.data.choices[0].message.content);
      } catch {
        jobs = [];
      }

      await db.collection("users").doc(userId).set({ matchedJobs: jobs, updatedAt: new Date() }, { merge: true });

      res.json(jobs);
    } catch {
      res.status(500).json({ error: "Failed to match jobs" });
    }
  });

  return router;
};
