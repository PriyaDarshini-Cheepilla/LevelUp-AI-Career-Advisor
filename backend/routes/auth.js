module.exports = (admin) => {
  const express = require("express");
  const router = express.Router();

  // Verify Firebase ID token - used for securing API calls
  router.post("/verify", async (req, res) => {
    const { idToken } = req.body;
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      res.json({ uid: decodedToken.uid, email: decodedToken.email });
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  });

  return router;
};
