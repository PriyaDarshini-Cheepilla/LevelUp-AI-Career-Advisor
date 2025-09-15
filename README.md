# 🚀 LevelUp: Personalized Career Companion  

LevelUp is a career guidance platform that empowers students and professionals to **analyze resumes, test skills, recommend courses, track dream jobs, and chat with an AI mentor** — all in one place.  

Built for the **OpenAI x NxtWave Buildathon** 🎯  

---

## ✨ Features

- 📄 **Resume Analyzer** → Extracts skills, education, and projects using AI.  
- 🧩 **Skill Tests** → Adaptive quizzes (different each attempt) + radar chart visualization.  
- 🎓 **Free Courses Recommender** → Suggests best free courses (Coursera, FreeCodeCamp, etc.) for missing skills.  
- 💼 **Dream Job Tracker** → Tracks vacancies in dream companies and auto-fills job applications.  
- 🤖 **AI Career Mentor Chatbot** → Personalized guidance on careers, interviews, and skill growth.  
- 🔐 **Authentication** → Secure login/register with Firebase Auth.  

---

## 🏗️ Tech Stack

### **Frontend**
- Next.js (App Router)
- Tailwind CSS
- Firebase Auth
- Chart.js (Radar Charts)
- Lucide React (icons)

### **Backend**
- Node.js + Express
- Firebase Admin SDK (Firestore for user data, chat history, skills)
- OpenAI GPT (resume parsing, skill tests, chatbot)
- CORS, dotenv, body-parser

---

## 📂 Project Structure

levelup/
│
├── backend/ # Express + Firebase Admin + OpenAI
│ ├── index.js
│ ├── firebase.js
│ ├── routes/
│ │ ├── resume.js
│ │ ├── career.js
│ │ ├── test.js
│ │ ├── courses.js
│ │ ├── jobs.js
│ │ └── chatbot.js
│ ├── package.json
│ └── .env
│
├── frontend/ # Next.js + Tailwind + Firebase Auth
│ ├── app/
│ │ ├── globals.css
│ │ ├── layout.js
│ │ ├── login.js
│ │ ├── dashboard.js
│ │ ├── upload.js
│ │ ├── career.js
│ │ ├── test.js
│ │ ├── courses.js
│ │ ├── jobs.js
│ │ └── chatbot.js
│ ├── components/
│ │ ├── Navbar.js
│ │ └── RadarChart.js
│ ├── firebase.js
│ ├── tailwind.config.js
│ ├── postcss.config.js
│ ├── package.json
│ └── .env.local
│
├── README.md
└── .gitignore

🎯 Usage Flow

1. Login/Register → via Firebase Auth

2. Dashboard → Navigate all features

3. Upload Resume → Extract skills & gaps

4. Skill Test → Take adaptive quiz, view radar chart

5. Courses → Explore free resources to fill skill gaps

6. Jobs → Track dream jobs & vacancies

7. Chatbot → Get personalized career mentoring