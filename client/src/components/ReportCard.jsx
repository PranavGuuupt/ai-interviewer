import React from "react";
import {
    TrendingUp,
    MessageSquare,
    Target,
    Award,
    Lightbulb,
    ArrowRight,
    Download,
    RotateCcw,
} from "lucide-react";
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

const CircularProgress = ({ score, label, color }) => {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-4 group">
            <div className="relative w-40 h-40">
                <svg className="transform -rotate-90 w-40 h-40 drop-shadow-lg">
                    {/* Background circle */}
                    <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="none"
                        className="text-white/5"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className={cn(
                            "transition-all duration-1000 ease-out",
                            color
                        )}
                        strokeLinecap="round"
                    />
                </svg>
                {/* Score display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-white tracking-tighter">
                        {score}
                    </span>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest mt-1">
                        Score
                    </span>
                </div>
            </div>
            <div className="text-center">
                <p className="font-mono text-xs uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">
                    {label}
                </p>
            </div>
        </div>
    );
};

const FeedbackCard = ({ item, index }) => {
    return (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-[#ccff00]/30 hover:bg-white/10 transition-all duration-300 group">
            <div className="flex items-start gap-5">
                <div className="w-8 h-8 rounded-lg bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center flex-shrink-0 text-[#ccff00] font-mono text-sm font-bold">
                    {String(index + 1).padStart(2, "0")}
                </div>
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-[#ccff00]" />
                        <h4 className="font-medium text-white text-lg tracking-tight">
                            {item.topic}
                        </h4>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                                <MessageSquare className="w-3 h-3 text-white/40" />
                                <span className="text-xs text-white/40 uppercase tracking-wider">
                                    Analysis
                                </span>
                            </div>
                            <p className="text-white/70 text-sm leading-relaxed">
                                {item.feedback}
                            </p>
                        </div>

                        <div className="bg-[#ccff00]/5 rounded-xl p-4 border border-[#ccff00]/10">
                            <div className="flex items-center gap-2 mb-2">
                                <Lightbulb className="w-3 h-3 text-[#ccff00]" />
                                <span className="text-xs text-[#ccff00] uppercase tracking-wider">
                                    Better Approach
                                </span>
                            </div>
                            <p className="text-white/90 text-sm leading-relaxed">
                                {item.better_answer}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ReportCard = ({ analysis, onClose }) => {
    const { technical_score, communication_score, confidence_score, feedback } =
        analysis;

    const averageScore = Math.round(
        (technical_score + communication_score + confidence_score) / 3
    );

    const getOverallRating = (score) => {
        if (score >= 90)
            return {
                text: "Outstanding",
                color: "text-[#ccff00]",
                sub: "Top 5% Candidate",
            };
        if (score >= 75)
            return {
                text: "Strong",
                color: "text-white",
                sub: "Ready for Next Round",
            };
        if (score >= 60)
            return {
                text: "Good",
                color: "text-white/80",
                sub: "Solid Foundation",
            };
        if (score >= 40)
            return {
                text: "Fair",
                color: "text-white/60",
                sub: "Needs Preparation",
            };
        return {
            text: "Developing",
            color: "text-white/40",
            sub: "Fundamental Gaps",
        };
    };

    const downloadReport = () => {
        const rating = getOverallRating(averageScore);
        const date = new Date().toLocaleDateString();

        let reportContent = `
═══════════════════════════════════════════════════════════
                    AI INTERVIEWER - SESSION REPORT
═══════════════════════════════════════════════════════════

Date: ${date}
Overall Rating: ${rating.text} (${rating.sub})

───────────────────────────────────────────────────────────
                         SCORES
───────────────────────────────────────────────────────────

Overall Score:        ${averageScore}/100
Technical Score:      ${technical_score}/100
Communication Score:  ${communication_score}/100
Confidence Score:     ${confidence_score}/100

───────────────────────────────────────────────────────────
                     DETAILED FEEDBACK
───────────────────────────────────────────────────────────
`;

        feedback.forEach((item, index) => {
            reportContent += `
${index + 1}. ${item.topic}
   Analysis: ${item.feedback}
   Suggestion: ${item.suggestion}
`;
        });

        reportContent += `
═══════════════════════════════════════════════════════════
                Generated by AI Interviewer
═══════════════════════════════════════════════════════════
`;

        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `interview-report-${date.replace(/\//g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const rating = getOverallRating(averageScore);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4 selection:bg-[#ccff00] selection:text-black">
            <div className="max-w-5xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ccff00]/20 bg-[#ccff00]/5 text-[#ccff00] text-xs font-mono mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse"></span>
                            REPORT GENERATED SUCCESSFULY
                        </div>
                        <h1 className="text-5xl md:text-6xl font-medium tracking-tighter text-white mb-2">
                            Session{" "}
                            <span className="text-[#ccff00] font-serif italic">
                                Report
                            </span>
                        </h1>
                        <p className="text-white/60 text-lg max-w-lg">
                            Comprehensive analysis of your technical proficiency
                            and communication style.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={downloadReport}
                            className="p-4 rounded-full border border-white/10 hover:bg-white/5 hover:border-[#ccff00]/30 transition-colors group"
                            title="Download Report"
                        >
                            <Download className="w-5 h-5 text-white/60 group-hover:text-[#ccff00]" />
                        </button>
                    </div>
                </div>

                {/* Score Overview */}
                <GlassPanel className="rounded-[2.5rem] p-8 md:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Overall Score Left */}
                        <div className="lg:col-span-4 text-center lg:text-left space-y-2">
                            <p className="text-xs font-mono text-white/40 uppercase tracking-widest">
                                Cumulative Score
                            </p>
                            <div className="text-[8rem] leading-[0.8] font-bold tracking-tighter text-white">
                                {averageScore}
                            </div>
                            <div>
                                <p
                                    className={cn(
                                        "text-2xl font-medium",
                                        rating.color
                                    )}
                                >
                                    {rating.text}
                                </p>
                                <p className="text-white/40">{rating.sub}</p>
                            </div>
                        </div>

                        {/* Breakdown Right */}
                        <div className="lg:col-span-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <CircularProgress
                                    score={technical_score}
                                    label="Technical"
                                    color="text-white"
                                />
                                <CircularProgress
                                    score={communication_score}
                                    label="Communication"
                                    color="text-[#ccff00]"
                                />
                                <CircularProgress
                                    score={confidence_score}
                                    label="Confidence"
                                    color="text-emerald-400"
                                />
                            </div>
                        </div>
                    </div>
                </GlassPanel>

                {/* Feedback Section */}
                <div className="space-y-8">
                    <div className="flex items-end justify-between border-b border-white/10 pb-6">
                        <h2 className="text-3xl font-medium">
                            Analysis Breakdown
                        </h2>
                        <span className="text-white/40 font-mono text-xs">
                            {feedback?.length || 0} INSIGHTS FOUND
                        </span>
                    </div>

                    <div className="space-y-4">
                        {feedback &&
                            feedback.map((item, index) => (
                                <FeedbackCard
                                    key={index}
                                    item={item}
                                    index={index}
                                />
                            ))}
                    </div>
                </div>

                {/* Footer Action */}
                {onClose && (
                    <div className="pt-12 flex justify-center">
                        <button
                            onClick={onClose}
                            className="group relative px-8 py-4 bg-[#ccff00] text-black rounded-full font-bold text-lg overflow-hidden transition-transform hover:scale-105"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <RotateCcw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" />
                                Start New Session
                            </span>
                            <div className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportCard;
