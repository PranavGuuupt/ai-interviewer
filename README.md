# AI Interviewer - Backend

A MERN stack SaaS application for AI-powered interviews with voice generation using edge-tts.

## 🏗️ Tech Stack

-   **Backend**: Node.js with Express
-   **Database**: MongoDB with Mongoose
-   **Voice Generation**: Python edge-tts library
-   **Dependencies**: CORS, dotenv, Multer, Axios

## 📁 Project Structure

```
AI-INTERVIEWER/
├── server.js                 # Main Express server
├── package.json              # Node.js dependencies
├── .env                      # Environment variables (create from .env.example)
├── .env.example              # Environment variables template
├── python-scripts/
│   └── tts.py               # Edge-TTS Python script
├── utils/
│   └── voiceHandler.js      # Voice generation utility
├── public/
│   └── audio/               # Generated audio files
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

-   Node.js (v14 or higher)
-   MongoDB (local or Atlas)
-   Python 3.7+
-   pip (Python package manager)

### Step 1: Install Node.js Dependencies

```bash
npm install
```

### Step 2: Install Python Dependencies

```bash
pip install edge-tts
```

Or if you're using Python 3:

```bash
pip3 install edge-tts
```

### Step 3: Configure Environment Variables

Create a `.env` file by copying `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and update the values:

```env
MONGODB_URI=mongodb://localhost:27017/ai-interviewer
PORT=5000
PYTHON_EXECUTABLE=python
```

**Note**: For Windows, use `python` or `py`. For Linux/Mac, use `python3`.

### Step 4: Start MongoDB

Make sure MongoDB is running on your system:

```bash
# For local MongoDB
mongod
```

Or use MongoDB Atlas connection string in your `.env` file.

### Step 6: Start the Frontend

1. Navigate to the client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will launch on `http://localhost:5173`.

## 🎤 Voice Generation API

### Generate Speech

**Endpoint**: `POST /api/voice/generate` (to be implemented)

**Request Body**:

```json
{
    "text": "Hello, welcome to your AI interview"
}
```

**Response**:

```json
{
    "success": true,
    "message": "Speech generated successfully",
    "data": {
        "filename": "speech_20231222_123456_789012.mp3",
        "audioUrl": "/audio/speech_20231222_123456_789012.mp3"
    }
}
```

### Using Voice Handler Directly

```javascript
const { generateSpeech } = require("./utils/voiceHandler");

// Generate speech
try {
    const result = await generateSpeech("Hello, this is a test");
    console.log("Audio file:", result.filename);
    console.log("Audio URL:", result.audioUrl);
} catch (error) {
    console.error("Error:", error.message);
}
```

## 🧪 Testing Voice Generation

You can test the Python script directly:

```bash
python python-scripts/tts.py "Hello, this is a test message"
```

This will generate an MP3 file in `public/audio/`.

## 📝 Available Voices

The default voice is **en-US-AriaNeural** (high-quality female voice).

Other available voices:

-   `en-US-GuyNeural` - Male voice
-   `en-US-JennyNeural` - Female voice
-   `en-GB-RyanNeural` - British male voice
-   `en-GB-SoniaNeural` - British female voice

To change the voice, edit the `VOICE` constant in `python-scripts/tts.py`.

## 🔧 Development

### Adding Routes

Create route files in a `routes/` directory and import them in `server.js`:

```javascript
app.use("/api/voice", require("./routes/voice"));
app.use("/api/interviews", require("./routes/interviews"));
```

### Adding Models

Create Mongoose models in a `models/` directory:

```javascript
const mongoose = require("mongoose");

const InterviewSchema = new mongoose.Schema({
    // your schema here
});

module.exports = mongoose.model("Interview", InterviewSchema);
```

## 🐛 Troubleshooting

### Python not found

-   Make sure Python is installed and in your PATH
-   Update `PYTHON_EXECUTABLE` in `.env` to the correct Python command

### edge-tts not installed

```bash
pip install edge-tts
```

### MongoDB connection failed

-   Ensure MongoDB is running
-   Check your `MONGODB_URI` in `.env`

### Audio files not accessible

-   Check that `public/audio/` directory exists
-   Ensure the Express static middleware is configured correctly

## 📄 License

ISC
