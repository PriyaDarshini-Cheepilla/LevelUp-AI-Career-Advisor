module.exports = (openai, db) => {
  const express = require("express");
  const router = express.Router();

  // Chatbot responds using GPT-4o-mini, maintaining conversation history in Firestore
  router.post("/message", async (req, res) => {
    const { userId, messages } = req.body; // messages: [{role: "user"|"assistant", content: string}]

    if (!userId || !messages) {
      return res.status(400).json({ error: "userId and messages are required" });
    }

    try {
      // Limit messages length for prompt
      const trimmedMessages = messages.slice(-10);

      const systemMessage = {
        role: "system",
        content: "You are a helpful career mentor chatbot providing concise, motivational and actionable career advice.",
      };

      const chatCompletion = await openai.createChatCompletion({
        model: "gpt-4o-mini",
        messages: [systemMessage, ...trimmedMessages],
        temperature: 0.7,
        max_tokens: 500,
      });

      const reply = chatCompletion.data.choices[0].message.content;

      // Save conversation snippet to Firestore chat history
      const userRef = db.collection("users").doc(userId);
      await userRef.collection("chat").add({
        messages,
        reply,
        timestamp: new Date(),
      });

      res.json({ reply });
    } catch {
      res.status(500).json({ error: "Chatbot error" });
    }
  });

  return router;
};
