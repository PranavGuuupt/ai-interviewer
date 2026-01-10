# AI Interviewer 🎤

A full-stack AI-powered interview platform built with the MERN stack, featuring voice synthesis, real-time AI conversations, and comprehensive recruiter analytics.

## ✨ Features

### For Candidates
- 📄 **Resume Upload** - AI analyzes your resume for context
- 🎙️ **Voice Conversations** - Natural AI-powered interviews
- 📊 **Instant Feedback** - Detailed performance report after each interview
- ⏱️ **Flexible Duration** - Timer-based interviews (1-120 minutes)

### For Recruiters
- 🔐 **Secure Authentication** - Powered by Clerk (Google, Email)
- 📝 **Job Management** - Create, edit, delete job postings
- 🔗 **Magic Links** - Unique interview links for each position
- 📈 **Analytics Dashboard** - Track candidate performance
- 📥 **Report Downloads** - Export candidate reports

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + TailwindCSS |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | [Clerk](https://clerk.com) |
| AI | Groq API (LLaMA) |
| Voice | Python edge-tts |

## 📁 Project Structure

```
ai-interviewer/
├── server.js                 # Express server
├── models/
│   ├── Job.js               # Job postings (with recruiterId)
│   └── Interview.js         # Interview results (with jobId)
├── controllers/
│   ├── aiController.js      # AI/Groq integration
│   └── jobController.js     # Job CRUD operations
├── routes/
│   ├── jobs.js              # Job API routes
│   ├── interview.js         # Interview API routes
│   └── resume.js            # Resume parsing routes
├── client/                   # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Dashboard.jsx      # Recruiter dashboard
│   │   │   ├── CandidateFlow.jsx  # Interview flow
│   │   │   ├── RecruiterJobPage.jsx
│   │   │   ├── SignInPage.jsx     # Clerk auth
│   │   │   └── SignUpPage.jsx
│   │   └── components/
│   │       ├── InterviewRoom.jsx
│   │       ├── ReportCard.jsx
│   │       └── ResumeUpload.jsx
│   └── .env                  # Frontend env (VITE_CLERK_PUBLISHABLE_KEY)
├── python-scripts/
│   └── tts.py               # Voice synthesis
└── .env                      # Backend env
```

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Python 3.7+
- Clerk account ([clerk.com](https://clerk.com))
- Groq API key ([console.groq.com](https://console.groq.com))

### 1. Clone & Install

```bash
# Clone repo
git clone https://github.com/Ayush-Pokhariya-07/ai-interviewer.git
cd ai-interviewer

# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install
```

### 2. Setup Python TTS

```bash
pip install edge-tts
# or: pip3 install edge-tts
```

### 3. Configure Environment

**Backend `.env`:**
```env
MONGODB_URI=mongodb+srv://your_connection_string
PORT=5000
GROQ_API_KEY=gsk_your_key_here
CLERK_SECRET_KEY=sk_test_your_key
PYTHON_EXECUTABLE=python3
```

**Frontend `client/.env`:**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key
```

### 4. Start Development

```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend
cd client && npm run dev
```

Visit `http://localhost:5173`

## 🔐 Authentication

Routes are protected based on user type:

| Route | Auth Required | User Type |
|-------|---------------|-----------|
| `/` | ❌ | Public |
| `/start` | ❌ | Candidates |
| `/interview/:jobId` | ❌ | Candidates |
| `/sign-in` | ❌ | Public |
| `/sign-up` | ❌ | Public |
| `/dashboard` | ✅ | Recruiters |
| `/recruiter` | ✅ | Recruiters |

## 📡 API Endpoints

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs/all` | Get recruiter's jobs |
| POST | `/api/jobs/create` | Create new job |
| GET | `/api/jobs/:id` | Get job details |
| PUT | `/api/jobs/:id` | Update job |
| DELETE | `/api/jobs/:id` | Delete job + interviews |
| GET | `/api/jobs/:id/interviews` | Get job's candidates |

### Interviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/interview/process` | Process interview audio |
| POST | `/api/interview/analyze` | Analyze & save interview |
| GET | `/api/interview/all` | Get all interviews |

### Resume
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resume/parse` | Parse uploaded resume |

## 🧪 Testing

```bash
# Backend health check
curl http://localhost:5000/api/jobs/check/health

# Frontend
open http://localhost:5173
```

## 📦 Deployment

### Vercel (Frontend)
```bash
cd client
vercel
```

### Railway/Render (Backend)
Ensure environment variables are set in the dashboard.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with ❤️ by [Ayush Pokhariya](https://github.com/Ayush-Pokhariya-07)
