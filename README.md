# 🤖 VantageAI – AI-Powered Mock Interview Platform

VantageAI is your **personal AI-powered interview coach**.  
Our platform simulates real-world interview scenarios, asks tailored questions, and delivers instant, in-depth feedback on your performance.  

Whether it’s **HR, technical, coding, or case-based interviews**, VantageAI helps you practice effectively, refine communication, and build confidence.

---
## 📊 Main Page


---
## 📌 Features

- 🎯 **Personalized Interview Setup**  
  - Choose your **tech stack**.  
  - Select **experience level** (Entry/Fresher, Mid-Level, Senior).  
  - Pick your **role preference** (Frontend, Backend, AI Developer, etc.).  
  - Decide the **interview type** (Technical, Behavioral, or Mixed).  

- 🗣️ **AI-Powered Interviews**  
  - Conducted in real-time by a **VAPI-powered AI assistant**.  
  - Tailored questions based on your selections.  

- 📊 **Instant Feedback**  
  - Get detailed performance feedback on each interview.  
  - Identify strengths, weaknesses, and improvement areas.  

- 🔁 **Retake & Improve**  
  - Retry the same interview multiple times.  
  - Get updated feedback after every attempt.  

---

## 🏗️ Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/), [React.js](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/)  
- **AI & Voice:** [VAPI](https://vapi.ai/)  
- **Backend & Database:** [Firebase](https://firebase.google.com/)  

---

## 🔐 Authentication Flow

VantageAI uses **Firebase Authentication with Session Cookies** for secure login and persistent sessions.

### Flow:
1. User signs in via **Email/Google/Facebook**.  
2. Firebase Auth validates credentials and issues an **ID Token**.  
3. The **Admin SDK** verifies the token and creates a **Session Cookie**.  
4. All requests use the session cookie for authentication.  
5. Admin SDK verifies sessions and fetches user records from **Firestore**.  

### Sequence Diagram

<img width="1658" height="732" alt="image" src="https://github.com/user-attachments/assets/6473f89f-1fd1-4369-8cb8-db5ecfd976aa" />

[Diagram](https://app.eraser.io/workspace/RxZgj1TINDv8zS8A5LCH)

## 🚀 Deployment  

The project is deployed on **Vercel**:  
👉 [https://vantage-ai-ten.vercel.app/](https://vantage-ai-ten.vercel.app/)  

---

## 🌟 Future Enhancements  

- 📌 Multi-language interview support.  
- 📌 Dashboard with analytics & progress tracking.  
- 📌 Integration with coding IDEs for live coding rounds.  
- 📌 Role-specific question banks curated by industry experts.  
- 📌 AI-driven scoring system with percentile benchmarks.

## 📜 License

This project is licensed under the MIT License.
