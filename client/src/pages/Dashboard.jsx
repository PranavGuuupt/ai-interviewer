import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    BarChart3,
    ArrowLeft,
    Plus,
    Calendar,
    User,
    Briefcase,
    Award,
    Search,
    Filter,
} from "lucide-react";
import axios from "axios";
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

const GridPattern = () => (
    <div className="absolute inset-0 z-0 pointer-events-none fixed">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div
            className="absolute inset-0"
            style={{
                backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
            }}
        ></div>
    </div>
);

const Dashboard = () => {
    const navigate = useNavigate();
    const [interviews, setInterviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchInterviews();
    }, []);

    const fetchInterviews = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // TODO: Backend endpoint needs to be created
            // For now, this will fail gracefully and show empty state
            const response = await axios.get("/api/interview/all");
            setInterviews(response.data.data || []);
        } catch (err) {
            console.error("Failed to fetch interviews:", err);
            // Set empty array on error to show "no interviews" state
            setInterviews([]);
            if (err.response?.status !== 404) {
                setError(
                    "Unable to load interviews. The endpoint may not be available yet."
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getScoreBadgeColor = (score) => {
        if (score >= 80)
            return "bg-[#ccff00]/10 text-[#ccff00] border-[#ccff00]/20";
        if (score >= 60) return "bg-white/5 text-white border-white/10";
        return "bg-red-500/10 text-red-400 border-red-500/20";
    };

    const calculateAverageScore = () => {
        if (interviews.length === 0) return 0;
        const sum = interviews.reduce(
            (acc, interview) => acc + (interview.technicalScore || 0),
            0
        );
        return Math.round(sum / interviews.length);
    };

    const activeJobs = interviews.filter(
        (i) => i.jobRole && i.jobRole !== "Practice"
    ).length;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#ccff00] selection:text-black font-sans relative overflow-x-hidden">
            <GridPattern />

            {/* Ambient Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#ccff00] rounded-full blur-[180px] opacity-[0.05] pointer-events-none"></div>

            {/* Header */}
            <header className="border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50 relative">
                <div className="max-w-[1800px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 cursor-pointer group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#ccff00]/50 transition-colors">
                                <ArrowLeft className="w-4 h-4 text-white group-hover:text-[#ccff00]" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-px h-8 bg-white/10"></span>
                            <h1 className="font-medium text-lg tracking-tight">
                                Recruiter{" "}
                                <span className="text-white/40">Dashboard</span>
                            </h1>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate("/recruiter")}
                        className="flex items-center gap-2 px-5 py-2 bg-[#ccff00] text-black rounded-full font-bold text-sm tracking-wide hover:bg-[#b3e600] transition-all shadow-[0_0_20px_rgba(204,255,0,0.15)] hover:shadow-[0_0_30px_rgba(204,255,0,0.3)] hover:-translate-y-0.5"
                    >
                        <Plus className="w-4 h-4" />
                        New Job Post
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-[1800px] mx-auto px-6 py-12 relative z-10">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <GlassPanel className="rounded-2xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <User className="w-24 h-24 text-white" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-white/40 font-mono text-xs uppercase tracking-widest mb-2">
                                Total Candidates
                            </p>
                            <div className="text-5xl font-bold tracking-tight text-white mb-2">
                                {interviews.length}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#ccff00]">
                                <span className="bg-[#ccff00]/10 px-2 py-0.5 rounded border border-[#ccff00]/20">
                                    +12%
                                </span>
                                <span className="text-white/40">
                                    from last week
                                </span>
                            </div>
                        </div>
                    </GlassPanel>

                    <GlassPanel className="rounded-2xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Briefcase className="w-24 h-24 text-[#ccff00]" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-white/40 font-mono text-xs uppercase tracking-widest mb-2">
                                Active Roles
                            </p>
                            <div className="text-5xl font-bold tracking-tight text-white mb-2">
                                {activeJobs}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-emerald-400">
                                <span className="bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                    Active
                                </span>
                                <span className="text-white/40">
                                    hiring pipelines
                                </span>
                            </div>
                        </div>
                    </GlassPanel>

                    <GlassPanel className="rounded-2xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Award className="w-24 h-24 text-[#ccff00]" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-white/40 font-mono text-xs uppercase tracking-widest mb-2">
                                Avg. Technical Score
                            </p>
                            <div className="text-5xl font-bold tracking-tight text-[#ccff00] mb-2">
                                {calculateAverageScore()}%
                            </div>
                            <div className="flex items-center gap-2 text-xs text-white">
                                <span className="bg-white/10 px-2 py-0.5 rounded border border-white/20">
                                    Top 15%
                                </span>
                                <span className="text-white/40">
                                    market average
                                </span>
                            </div>
                        </div>
                    </GlassPanel>
                </div>

                {/* Interviews Table */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-medium tracking-tight">
                            Recent Interviews
                        </h2>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                                <input
                                    type="text"
                                    placeholder="Search candidates..."
                                    className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#ccff00]/50 transition-colors w-64"
                                />
                            </div>
                            <button className="p-2 rounded-full border border-white/10 hover:bg-white/5 text-white/60 hover:text-white">
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <GlassPanel className="rounded-2xl overflow-hidden">
                        {isLoading ? (
                            <div className="p-20 text-center">
                                <div className="w-8 h-8 rounded-full border-2 border-[#ccff00]/20 border-t-[#ccff00] animate-spin mx-auto mb-4"></div>
                                <p className="text-white/40 font-mono text-sm uppercase tracking-widest">
                                    Loading Data...
                                </p>
                            </div>
                        ) : error ? (
                            <div className="p-20 text-center">
                                <p className="text-red-400 mb-2 font-mono text-sm">
                                    {error}
                                </p>
                            </div>
                        ) : interviews.length === 0 ? (
                            <div className="p-24 text-center">
                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                                    <BarChart3 className="w-10 h-10 text-white/20" />
                                </div>
                                <h3 className="text-xl font-medium text-white mb-2">
                                    No Interviews Yet
                                </h3>
                                <p className="text-white/40 max-w-sm mx-auto mb-8">
                                    Start by creating a job post and sharing the
                                    link with candidates.
                                </p>
                                <button
                                    onClick={() => navigate("/recruiter")}
                                    className="px-8 py-3 bg-[#ccff00] text-black rounded-full font-bold text-sm tracking-wide hover:bg-[#b3e600] transition-colors"
                                >
                                    Create First Job
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-white/[0.02]">
                                            <th className="px-8 py-6 text-left text-xs font-mono font-medium text-white/40 uppercase tracking-widest">
                                                Candidate
                                            </th>
                                            <th className="px-8 py-6 text-left text-xs font-mono font-medium text-white/40 uppercase tracking-widest">
                                                Role
                                            </th>
                                            <th className="px-8 py-6 text-left text-xs font-mono font-medium text-white/40 uppercase tracking-widest">
                                                Difficulty
                                            </th>
                                            <th className="px-8 py-6 text-left text-xs font-mono font-medium text-white/40 uppercase tracking-widest">
                                                Duration
                                            </th>
                                            <th className="px-8 py-6 text-left text-xs font-mono font-medium text-white/40 uppercase tracking-widest">
                                                Score
                                            </th>
                                            <th className="px-8 py-6 text-left text-xs font-mono font-medium text-white/40 uppercase tracking-widest">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {interviews.map((interview) => (
                                            <tr
                                                key={
                                                    interview._id ||
                                                    interview.id
                                                }
                                                className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                                            >
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-[#ccff00] text-black flex items-center justify-center font-bold">
                                                            {(
                                                                interview.candidateName ||
                                                                "U"
                                                            )
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>
                                                        <span className="font-medium text-white group-hover:text-[#ccff00] transition-colors">
                                                            {interview.candidateName ||
                                                                "Unknown"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span
                                                        className={
                                                            !interview.jobRole ||
                                                            interview.jobRole ===
                                                                "Practice"
                                                                ? "text-white/40 italic"
                                                                : "text-white/80"
                                                        }
                                                    >
                                                        {interview.jobRole ||
                                                            "Practice"}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span
                                                        className={cn(
                                                            "px-3 py-1 rounded-full text-xs font-medium border",
                                                            interview.difficulty ===
                                                                "Hard"
                                                                ? "bg-red-500/10 text-red-400 border-red-500/20"
                                                                : interview.difficulty ===
                                                                  "Medium"
                                                                ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                        )}
                                                    >
                                                        {interview.difficulty ||
                                                            "N/A"}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-white/40 text-sm font-mono">
                                                    {interview.duration ||
                                                        "N/A"}
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span
                                                        className={cn(
                                                            "px-3 py-1 rounded-full text-xs font-bold border",
                                                            getScoreBadgeColor(
                                                                interview.technicalScore ||
                                                                    0
                                                            )
                                                        )}
                                                    >
                                                        {interview.technicalScore ||
                                                            0}
                                                        %
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-white/40 text-sm font-mono">
                                                    {interview.createdAt
                                                        ? new Date(
                                                              interview.createdAt
                                                          ).toLocaleDateString()
                                                        : "N/A"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </GlassPanel>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
