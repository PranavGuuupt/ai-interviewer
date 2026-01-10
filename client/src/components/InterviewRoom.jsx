import React, { useState, useRef, useEffect } from "react";
import {
    Mic,
    Square,
    Loader2,
    Volume2,
    Send,
    FileCheck,
    Clock,
    AlertCircle,
    ArrowUpRight,
} from "lucide-react";
import axios from "axios";
import ReportCard from "./ReportCard";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const GlassPanel = ({ children, className }) => (
    <div
        className={cn(
            "bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl",
            className
        )}
    >
        {children}
    </div>
);

const InterviewRoom = ({
    resumeData,
    jobId,
    jobRole,
    jobDescription,
    difficulty,
    duration,
}) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState(null);
    const [showReportCard, setShowReportCard] = useState(false);
    const [reportAnalysis, setReportAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Timer state
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [showWarning, setShowWarning] = useState(false);
    const timerRef = useRef(null);

    // Build personalized greeting based on resume and job data
    const buildGreeting = () => {
        let greeting = `Hello ${resumeData?.fullName || "there"
            }! I'm your AI Interviewer. `;

        if (jobRole) {
            greeting += `Today, we'll be interviewing you for the role of ${jobRole}. `;
            greeting += `This is a ${difficulty} difficulty interview. `;
        } else if (resumeData) {
            greeting += `I've reviewed your resume and I'm excited to discuss your skills. `;
        }

        greeting += "Let's begin!";
        return greeting;
    };

    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: buildGreeting(),
            timestamp: new Date().toISOString(),
        },
    ]);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const messagesEndRef = useRef(null);
    const currentAudioRef = useRef(null);

    // Parse duration and start timer
    useEffect(() => {
        console.log(`⏱️ Duration prop received:`, duration, `(type: ${typeof duration})`);

        let minutes = null;

        if (duration !== undefined && duration !== null) {
            // Handle numeric duration (new format: 15, 30, etc.)
            if (typeof duration === 'number' && duration > 0) {
                minutes = duration;
            }
            // Handle string duration (legacy format: "Short (15 min)")
            else if (typeof duration === 'string') {
                const match = duration.match(/(\d+)/);
                if (match) {
                    minutes = parseInt(match[1]);
                }
            }
        }

        // Use parsed duration or fallback to 15 minutes
        const finalMinutes = (minutes && minutes > 0) ? minutes : 15;
        setTimeRemaining(finalMinutes * 60); // Convert to seconds
        console.log(`⏱️ Timer set to ${finalMinutes} minutes`);
    }, [duration]);

    // Countdown timer
    useEffect(() => {
        if (timeRemaining === null || timeRemaining < 0 || showReportCard) {
            return;
        }

        if (timeRemaining === 60 && !showWarning) {
            setShowWarning(true);
            setError("⏰ 1 minute left! Wrap up your answer.");
            setTimeout(() => setError(null), 5000);
        }

        if (timeRemaining === 0) {
            console.log("⏰ Timer expired - auto-ending interview");

            // Add goodbye message from interviewer
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Thank you for your time today! Our interview session has come to an end. It was a pleasure speaking with you. I'll now prepare your performance report. Good luck with your career journey! 👋",
                    timestamp: new Date().toISOString(),
                },
            ]);

            // Short delay to show goodbye message, then end interview
            setTimeout(() => {
                handleEndInterview();
            }, 2000);
            return;
        }

        timerRef.current = setTimeout(() => {
            setTimeRemaining((prev) => prev - 1);
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [timeRemaining, showReportCard]);

    const formatTime = (seconds) => {
        if (seconds === null) return null;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, {
                    type: "audio/webm",
                });
                await processAudio(audioBlob);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setError(null);
        } catch (err) {
            setError(
                "Could not access microphone. Please ensure you have granted permission."
            );
            console.error("Microphone error:", err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            mediaRecorderRef.current.stream
                .getTracks()
                .forEach((track) => track.stop());
        }
    };

    const processAudio = async (audioBlob) => {
        setIsProcessing(true);

        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");

        const history = messages.map((msg) => ({
            role: msg.role === "assistant" ? "assistant" : "user",
            content: msg.content,
        }));
        formData.append("history", JSON.stringify(history));

        if (resumeData) {
            formData.append("context", JSON.stringify(resumeData));
        }

        if (jobRole) {
            formData.append(
                "jobContext",
                JSON.stringify({
                    roleTitle: jobRole,
                    jobDescription: jobDescription,
                    difficulty: difficulty,
                    duration: duration,
                })
            );
        }

        try {
            const response = await axios.post(
                "/api/interview/process",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const { userTranscript, aiTranscript, audioUrl } = response.data;

            setMessages((prev) => [
                ...prev,
                {
                    role: "user",
                    content: userTranscript,
                    timestamp: new Date().toISOString(),
                },
                {
                    role: "assistant",
                    content: aiTranscript,
                    timestamp: new Date().toISOString(),
                },
            ]);

            if (audioUrl) {
                setIsPlaying(true);
                const audio = new Audio(audioUrl);
                currentAudioRef.current = audio; // Store reference
                audio.onended = () => {
                    setIsPlaying(false);
                    currentAudioRef.current = null;
                };
                await audio.play();
            }
        } catch (err) {
            console.error("Processing error:", err);
            setError("Failed to process interview response. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleEndInterview = async () => {
        // Stop any currently playing audio immediately
        if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current.currentTime = 0;
            currentAudioRef.current = null;
            setIsPlaying(false);
        }

        const conversationHistory = messages.slice(1).map((msg) => ({
            role: msg.role === "assistant" ? "assistant" : "user",
            content: msg.content,
        }));

        if (conversationHistory.length < 2) {
            setError(
                "Please have at least one exchange before ending the interview."
            );
            return;
        }

        setIsAnalyzing(true);
        setError(null);

        try {
            const payload = {
                history: conversationHistory,
                candidateName: resumeData?.fullName || "Anonymous",
                jobId: jobId || null,
                jobRole: jobRole || "Practice Interview",
                difficulty: difficulty || "N/A",
                duration: duration || "N/A",
            };

            if (jobRole) {
                payload.jobContext = {
                    roleTitle: jobRole,
                    jobDescription: jobDescription,
                    difficulty: difficulty,
                };
            }

            console.log("📤 Sending interview data:", payload);

            const response = await axios.post(
                "/api/interview/analyze",
                payload
            );

            if (response.data.success) {
                setReportAnalysis(response.data.analysis);
                setShowReportCard(true);
            }
        } catch (err) {
            console.error("Analysis error:", err);
            setError("Failed to analyze interview. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleNewInterview = () => {
        setShowReportCard(false);
        setReportAnalysis(null);
        setMessages([
            {
                role: "assistant",
                content:
                    "Hello! I'm your AI Interviewer. I'm ready to begin when you are. Click the microphone to start speaking.",
                timestamp: new Date().toISOString(),
            },
        ]);
    };

    if (showReportCard && reportAnalysis) {
        return (
            <ReportCard
                analysis={reportAnalysis}
                onClose={handleNewInterview}
            />
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-10rem)] max-w-5xl mx-auto gap-4 relative">
            {/* Header Controls */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-medium text-white tracking-tight">
                        Live Session
                    </h2>
                    <p className="text-white/40 text-sm">
                        Speak clearly for best results.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Timer */}
                    {timeRemaining !== null && (
                        <div
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-sm border transition-colors",
                                timeRemaining < 120
                                    ? "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse"
                                    : "bg-white/5 text-white/60 border-white/10"
                            )}
                        >
                            <Clock className="w-4 h-4" />
                            {formatTime(timeRemaining)}
                        </div>
                    )}

                    <button
                        onClick={handleEndInterview}
                        disabled={
                            isAnalyzing || isProcessing || messages.length <= 1
                        }
                        className={cn(
                            "px-5 py-2 rounded-full font-bold text-sm tracking-wide flex items-center gap-2 transition-all",
                            isAnalyzing
                                ? "bg-white/10 cursor-not-allowed opacity-50"
                                : "bg-[#ccff00] text-black hover:bg-[#b3e600] shadow-[0_0_15px_rgba(204,255,0,0.3)] hover:shadow-[0_0_20px_rgba(204,255,0,0.5)]",
                            messages.length <= 1
                                ? "opacity-30 cursor-not-allowed"
                                : ""
                        )}
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                End Interview
                                <ArrowUpRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <GlassPanel className="flex-1 rounded-[2rem] p-6 overflow-hidden flex flex-col relative">
                <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === "user"
                                ? "justify-end"
                                : "justify-start"
                                }`}
                        >
                            <div
                                className={cn(
                                    "max-w-[80%] rounded-2xl px-6 py-4 border text-sm leading-relaxed shadow-lg",
                                    msg.role === "user"
                                        ? "bg-[#ccff00]/10 text-[#ccff00] border-[#ccff00]/20 rounded-tr-sm backdrop-blur-md"
                                        : "bg-white/5 text-white/90 border-white/5 rounded-tl-sm backdrop-blur-md"
                                )}
                            >
                                <div className="flex items-center gap-2 mb-2 opacity-50 text-[10px] uppercase tracking-widest font-mono">
                                    {msg.role === "user"
                                        ? "You"
                                        : "Interviewer"}
                                </div>
                                <p>{msg.content}</p>
                            </div>
                        </div>
                    ))}

                    {isProcessing && (
                        <div className="flex justify-start">
                            <div className="bg-white/5 rounded-2xl px-6 py-4 rounded-tl-sm border border-white/5 flex items-center gap-3">
                                <Loader2 className="w-4 h-4 animate-spin text-[#ccff00]" />
                                <span className="text-white/40 text-xs font-mono uppercase tracking-wider">
                                    Analyzing Audio...
                                </span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Microphone Controls */}
                <div className="pt-6 mt-4 border-t border-white/5 flex items-center justify-center gap-8">
                    <div
                        className={cn(
                            "w-12 h-12 flex items-center justify-center rounded-full border transition-all duration-300",
                            isPlaying
                                ? "bg-[#ccff00]/10 border-[#ccff00]/30 text-[#ccff00] scale-110 shadow-[0_0_20px_rgba(204,255,0,0.2)]"
                                : "bg-transparent border-white/5 text-white/20"
                        )}
                    >
                        <Volume2 className="w-5 h-5" />
                    </div>
                    <button
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={isProcessing}
                        className={cn(
                            "relative group w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                            isProcessing
                                ? "border-white/10 text-white/20 cursor-not-allowed bg-white/5"
                                : isRecording
                                    ? "border-red-500 bg-red-500/10 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-pulse"
                                    : "border-[#ccff00] bg-[#ccff00]/5 text-[#ccff00] hover:bg-[#ccff00]/10 hover:scale-105 hover:shadow-[0_0_30px_rgba(204,255,0,0.3)]"
                        )}
                    >
                        {isRecording ? (
                            <Square className="w-8 h-8 fill-current" />
                        ) : (
                            <Mic className="w-8 h-8" />
                        )}
                    </button>
                    <div className="w-12 h-12" /> {/* Spacer */}
                </div>
            </GlassPanel>

            <div className="text-center">
                {isRecording ? (
                    <span className="text-red-400 text-xs font-mono uppercase tracking-widest animate-pulse flex items-center justify-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                        Recording
                    </span>
                ) : (
                    <span className="text-white/30 text-xs font-mono uppercase tracking-widest">
                        {isProcessing
                            ? "Processing Response..."
                            : "Tap Microphone to Speak"}
                    </span>
                )}
            </div>

            {error && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500/10 text-red-400 px-4 py-2 rounded-lg text-sm border border-red-500/20 backdrop-blur-md">
                    {error}
                </div>
            )}
        </div>
    );
};

export default InterviewRoom;
