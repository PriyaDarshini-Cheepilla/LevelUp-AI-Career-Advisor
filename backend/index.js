const express = require("express");
const cors = require("cors");
require("dotenv").config();
const admin = require("firebase-admin");
const OpenAI = require("openai");

// Initialize Express app
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});
const db = admin.firestore();

// Initialize OpenAI client with new SDK v4
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Import routes and inject dependencies
app.use("/auth", require("./routes/auth")(admin));
app.use("/resume", require("./routes/resume")(openai, db));
app.use("/career", require("./routes/career")(openai, db));
app.use("/test", require("./routes/test")(openai, db));
app.use("/courses", require("./routes/courses")(openai, db));
app.use("/jobs", require("./routes/jobs")(openai, db));
app.use("/chatbot", require("./routes/chatbot")(openai, db));

// Basic route for health check
app.get("/", (req, res) => {
  res.send("LevelUp AI Career Advisor Backend is running");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
