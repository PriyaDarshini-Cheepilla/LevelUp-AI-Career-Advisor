module.exports = (openai, db) => {
  const express = require("express");
  const router = express.Router();

  // Parse resume text, extracting skills, education, projects using GPT-4o
  router.post("/parse", async (req, res) => {
    const { resumeText, userId } = req.body;
    if (!resumeText || !userId) {
      return res.status(400).json({ error: "resumeText and userId are required" });
    }

    try {
      const prompt = `Extract skills, education, and projects from the resume below. Return JSON object with keys: skills[], education[], projects[].\nResume:\n${resumeText}`;
      const completion = await openai.createChatCompletion({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a resume parser generating structured JSON." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      });

      const responseText = completion.data.choices[0].message.content;
      let parsedJson;
      try {
        parsedJson = JSON.parse(responseText);
      } catch (err) {
        parsedJson = { skills: [], education: [], projects: [] };
      }

      // Save extracted data in Firestore user doc
      await db.collection("users").doc(userId).set(
        { resumeParsed: parsedJson, updatedAt: new Date() },
        { merge: true }
      );

      res.json(parsedJson);
    } catch (error) {
      res.status(500).json({ error: "Failed to parse resume" });
    }
  });

  return router;
};
