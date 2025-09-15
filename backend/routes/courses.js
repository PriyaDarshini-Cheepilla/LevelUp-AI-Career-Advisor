module.exports = (openai, db) => {
  const express = require("express");
  const router = express.Router();

  router.post("/recommend", async (req, res) => {
    const { userId, missingSkills } = req.body;
    if (!userId || !missingSkills) return res.status(400).json({ error: "userId & missingSkills required" });

    try {
      const systemPrompt = "You are a course recommendation engine focusing on free courses from Coursera, FreeCodeCamp, and YouTube.";
      const userPrompt = `Recommend top free courses for the following skills: ${missingSkills.join(", ")}. Provide course title and URL in JSON array.`;

      const completion = await openai.createChatCompletion({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
        temperature: 0.8,
      });

      let courses;
      try {
        courses = JSON.parse(completion.data.choices[0].message.content);
      } catch {
        courses = [];
      }

      await db.collection("users").doc(userId).set({ recommendedCourses: courses, updatedAt: new Date() }, { merge: true });

      res.json(courses);
    } catch {
      res.status(500).json({ error: "Failed to get course recommendations" });
    }
  });

  return router;
};
