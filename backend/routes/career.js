module.exports = (openai, db) => {
  const express = require("express");
  const router = express.Router();

  router.post("/roadmap", async (req, res) => {
    const { userId, skills } = req.body;
    if (!userId || !skills) {
      return res.status(400).json({ error: "userId and skills are required" });
    }

    const systemPrompt = "You are a career advisor that creates personalized career path, missing skills, and roadmap for the user.";

    const userPrompt = `Given the following skills: ${skills.join(", ")}, generate a career roadmap including: recommended career paths, missing skills to acquire, and steps for upskilling. Return as JSON with keys: careerPaths[], missingSkills[], roadmap[].`;

    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-4o",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
        temperature: 0.6,
      });

      const content = completion.data.choices[0].message.content;
      let parsed;
      try {
        parsed = JSON.parse(content);
      } catch {
        parsed = { careerPaths: [], missingSkills: [], roadmap: [] };
      }

      await db.collection("users").doc(userId).set({ careerPlan: parsed, updatedAt: new Date() }, { merge: true });

      res.json(parsed);
    } catch {
      res.status(500).json({ error: "Failed to generate career roadmap" });
    }
  });

  return router;
};
