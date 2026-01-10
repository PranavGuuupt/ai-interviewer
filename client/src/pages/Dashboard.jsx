import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import {
    BarChart3,
    ArrowLeft,
    Plus,
    Calendar,
    User,
    Briefcase,
    Award,
    Search,
    Edit3,
    Trash2,
    Users,
    TrendingUp,
    Download,
    Eye,
    Clock,
    ChevronRight,
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
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState("jobs");
    const [jobs, setJobs] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [jobInterviews, setJobInterviews] = useState([]);
    const [editingJob, setEditingJob] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (user?.id) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [jobsRes, interviewsRes] = await Promise.all([
                axios.get(`/api/jobs/all?recruiterId=${user.id}`),
                axios.get("/api/interview/all"),
            ]);
            setJobs(jobsRes.data.data || []);
            setInterviews(interviewsRes.data.data || []);
        } catch (err) {
            console.error("Failed to fetch data:", err);
            setError("Failed to load dashboard data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (!window.confirm("Are you sure? This will delete all associated interviews.")) return;

        try {
            await axios.delete(`/api/jobs/${jobId}`);
            setJobs(jobs.filter((j) => j.id !== jobId));
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const handleViewInterviews = async (job) => {
        setSelectedJob(job);
        try {
            const res = await axios.get(`/api/jobs/${job.id}/interviews`);
            setJobInterviews(res.data.data || []);
        } catch (err) {
            console.error("Failed to fetch interviews:", err);
            setJobInterviews([]);
        }
    };

    const downloadReport = (interview) => {
        const date = new Date(interview.createdAt).toLocaleDateString();
        const avg = interview.averageScore;

        let content = `
AI INTERVIEWER - CANDIDATE REPORT
=================================
Candidate: ${interview.candidateName}
Date: ${date}

SCORES
------
Technical: ${interview.technicalScore}/100
Communication: ${interview.communicationScore}/100
Confidence: ${interview.confidenceScore}/100
Average: ${avg}/100

FEEDBACK
--------
`;
        interview.feedback?.forEach((f, i) => {
            content += `${i + 1}. ${f.topic}\n   ${f.feedback}\n   Suggestion: ${f.suggestion}\n\n`;
        });

        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `report-${interview.candidateName}-${date.replace(/\//g, "-")}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const getScoreColor = (score) => {
        if (score >= 80) return "text-[#ccff00]";
        if (score >= 60) return "text-white";
        return "text-red-400";
    };

    // Analytics calculations
    const totalInterviews = interviews.length;
    const avgScore = interviews.length > 0
        ? Math.round(interviews.reduce((acc, i) => acc + ((i.technicalScore + i.communicationScore + i.confidenceScore) / 3), 0) / interviews.length)
        : 0;
    const topPerformers = interviews.filter(i => ((i.technicalScore + i.communicationScore + i.confidenceScore) / 3) >= 80).length;

    const filteredJobs = jobs.filter(j =>
        j.roleTitle?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const tabs = [
        { id: "jobs", label: "Jobs", icon: Briefcase },
        { id: "candidates", label: "Candidates", icon: Users },
        { id: "analytics", label: "Analytics", icon: TrendingUp },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#ccff00] selection:text-black font-sans relative overflow-x-hidden">
            <GridPattern />

            <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#ccff00] rounded-full blur-[180px] opacity-[0.05] pointer-events-none"></div>

            <div className="relative z-10 max-w-[1600px] mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#ccff00]/50 transition-colors">
                                <ArrowLeft className="w-4 h-4 text-white group-hover:text-[#ccff00]" />
                            </div>
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Recruiter Dashboard
                            </h1>
                            <p className="text-white/40 text-sm mt-1">
                                Manage jobs and view candidate analytics
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/recruiter")}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[#ccff00] text-black rounded-full font-bold text-sm tracking-wide hover:bg-[#b3e600] transition-all shadow-[0_0_20px_rgba(204,255,0,0.15)]"
                        >
                            <Plus className="w-4 h-4" />
                            New Job
                        </button>
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: "w-10 h-10"
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all",
                                activeTab === tab.id
                                    ? "bg-[#ccff00] text-black"
                                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <GlassPanel className="p-6 rounded-2xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#ccff00]/10 flex items-center justify-center">
                                <Briefcase className="w-6 h-6 text-[#ccff00]" />
                            </div>
                            <div>
                                <p className="text-white/40 text-sm">Active Jobs</p>
                                <p className="text-3xl font-bold">{jobs.length}</p>
                            </div>
                        </div>
                    </GlassPanel>

                    <GlassPanel className="p-6 rounded-2xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#ccff00]/10 flex items-center justify-center">
                                <Users className="w-6 h-6 text-[#ccff00]" />
                            </div>
                            <div>
                                <p className="text-white/40 text-sm">Total Interviews</p>
                                <p className="text-3xl font-bold">{totalInterviews}</p>
                            </div>
                        </div>
                    </GlassPanel>

                    <GlassPanel className="p-6 rounded-2xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#ccff00]/10 flex items-center justify-center">
                                <Award className="w-6 h-6 text-[#ccff00]" />
                            </div>
                            <div>
                                <p className="text-white/40 text-sm">Avg Score</p>
                                <p className={cn("text-3xl font-bold", getScoreColor(avgScore))}>{avgScore}</p>
                            </div>
                        </div>
                    </GlassPanel>
                </div>

                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="w-8 h-8 rounded-full border-2 border-[#ccff00]/20 border-t-[#ccff00] animate-spin mx-auto mb-4"></div>
                        <p className="text-white/40">Loading...</p>
                    </div>
                ) : (
                    <>
                        {/* Jobs Tab */}
                        {activeTab === "jobs" && (
                            <div>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="relative flex-1 max-w-md">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                        <input
                                            type="text"
                                            placeholder="Search jobs..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#ccff00]/50 text-sm"
                                        />
                                    </div>
                                </div>

                                {selectedJob ? (
                                    <div>
                                        <button
                                            onClick={() => setSelectedJob(null)}
                                            className="flex items-center gap-2 text-white/60 hover:text-white mb-4"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            Back to Jobs
                                        </button>

                                        <GlassPanel className="rounded-2xl p-6 mb-6">
                                            <h2 className="text-xl font-bold mb-2">{selectedJob.roleTitle}</h2>
                                            <p className="text-white/40 text-sm mb-4">{selectedJob.jobDescription?.slice(0, 200)}...</p>
                                            <div className="flex gap-4 text-sm text-white/60">
                                                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {selectedJob.duration} min</span>
                                                <span>{selectedJob.difficulty}</span>
                                                <span>{selectedJob.interviewCount} candidates</span>
                                            </div>
                                        </GlassPanel>

                                        <h3 className="text-lg font-bold mb-4">Candidates</h3>
                                        {jobInterviews.length === 0 ? (
                                            <p className="text-white/40 text-center py-10">No candidates have completed interviews yet.</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {jobInterviews.map((interview) => (
                                                    <GlassPanel key={interview.id} className="rounded-xl p-4 flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-[#ccff00] text-black flex items-center justify-center font-bold">
                                                                {interview.candidateName.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">{interview.candidateName}</p>
                                                                <p className="text-white/40 text-sm">{new Date(interview.createdAt).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-6">
                                                            <div className="text-center">
                                                                <p className="text-xs text-white/40">Technical</p>
                                                                <p className={cn("font-bold", getScoreColor(interview.technicalScore))}>{interview.technicalScore}</p>
                                                            </div>
                                                            <div className="text-center">
                                                                <p className="text-xs text-white/40">Communication</p>
                                                                <p className={cn("font-bold", getScoreColor(interview.communicationScore))}>{interview.communicationScore}</p>
                                                            </div>
                                                            <div className="text-center">
                                                                <p className="text-xs text-white/40">Confidence</p>
                                                                <p className={cn("font-bold", getScoreColor(interview.confidenceScore))}>{interview.confidenceScore}</p>
                                                            </div>
                                                            <div className="text-center border-l border-white/10 pl-6">
                                                                <p className="text-xs text-white/40">Average</p>
                                                                <p className={cn("font-bold text-lg", getScoreColor(interview.averageScore))}>{interview.averageScore}</p>
                                                            </div>
                                                            <button
                                                                onClick={() => downloadReport(interview)}
                                                                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                                                title="Download Report"
                                                            >
                                                                <Download className="w-4 h-4 text-white/60 hover:text-[#ccff00]" />
                                                            </button>
                                                        </div>
                                                    </GlassPanel>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {filteredJobs.length === 0 ? (
                                            <div className="text-center py-20">
                                                <Briefcase className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                                <p className="text-white/40 mb-4">No jobs created yet</p>
                                                <button
                                                    onClick={() => navigate("/recruiter")}
                                                    className="px-6 py-2.5 bg-[#ccff00] text-black rounded-full font-bold text-sm"
                                                >
                                                    Create Your First Job
                                                </button>
                                            </div>
                                        ) : (
                                            filteredJobs.map((job) => (
                                                <GlassPanel key={job.id} className="rounded-xl p-5 hover:border-[#ccff00]/30 transition-colors group">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-xl bg-[#ccff00]/10 flex items-center justify-center">
                                                                <Briefcase className="w-5 h-5 text-[#ccff00]" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-lg">{job.roleTitle}</h3>
                                                                <div className="flex gap-4 text-sm text-white/40 mt-1">
                                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {job.duration} min</span>
                                                                    <span>{job.difficulty}</span>
                                                                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {job.interviewCount} candidates</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className="text-right mr-4">
                                                                <p className="text-xs text-white/40">Avg Score</p>
                                                                <p className={cn("text-xl font-bold", getScoreColor(job.avgScore))}>{job.avgScore || "-"}</p>
                                                            </div>
                                                            <button
                                                                onClick={() => handleViewInterviews(job)}
                                                                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                                                title="View Candidates"
                                                            >
                                                                <Eye className="w-4 h-4 text-white/60" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteJob(job.id)}
                                                                className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                                                                title="Delete Job"
                                                            >
                                                                <Trash2 className="w-4 h-4 text-white/60 hover:text-red-400" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </GlassPanel>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Candidates Tab */}
                        {activeTab === "candidates" && (
                            <div>
                                <h2 className="text-lg font-bold mb-4">All Candidates ({interviews.length})</h2>
                                {interviews.length === 0 ? (
                                    <p className="text-white/40 text-center py-10">No interviews completed yet.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {interviews.map((interview) => (
                                            <GlassPanel key={interview._id || interview.id} className="rounded-xl p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-[#ccff00] text-black flex items-center justify-center font-bold">
                                                        {interview.candidateName?.charAt(0) || "?"}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{interview.candidateName}</p>
                                                        <p className="text-white/40 text-sm">{interview.jobRole} • {new Date(interview.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-center">
                                                        <p className="text-xs text-white/40">Technical</p>
                                                        <p className={cn("font-bold", getScoreColor(interview.technicalScore))}>{interview.technicalScore}</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-xs text-white/40">Communication</p>
                                                        <p className={cn("font-bold", getScoreColor(interview.communicationScore))}>{interview.communicationScore}</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-xs text-white/40">Confidence</p>
                                                        <p className={cn("font-bold", getScoreColor(interview.confidenceScore))}>{interview.confidenceScore}</p>
                                                    </div>
                                                </div>
                                            </GlassPanel>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Analytics Tab */}
                        {activeTab === "analytics" && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <GlassPanel className="rounded-2xl p-6">
                                    <h3 className="text-lg font-bold mb-4">Performance Overview</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/60">Total Interviews</span>
                                            <span className="font-bold text-2xl">{totalInterviews}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/60">Average Score</span>
                                            <span className={cn("font-bold text-2xl", getScoreColor(avgScore))}>{avgScore}/100</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/60">Top Performers (80+)</span>
                                            <span className="font-bold text-2xl text-[#ccff00]">{topPerformers}</span>
                                        </div>
                                    </div>
                                </GlassPanel>

                                <GlassPanel className="rounded-2xl p-6">
                                    <h3 className="text-lg font-bold mb-4">Score Distribution</h3>
                                    <div className="space-y-3">
                                        {["Technical", "Communication", "Confidence"].map((metric) => {
                                            const key = `${metric.toLowerCase()}Score`;
                                            const avg = interviews.length > 0
                                                ? Math.round(interviews.reduce((acc, i) => acc + (i[key] || 0), 0) / interviews.length)
                                                : 0;
                                            return (
                                                <div key={metric}>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="text-white/60">{metric}</span>
                                                        <span className={getScoreColor(avg)}>{avg}%</span>
                                                    </div>
                                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                        <div
                                                            className={cn("h-full rounded-full transition-all", avg >= 80 ? "bg-[#ccff00]" : avg >= 60 ? "bg-white" : "bg-red-400")}
                                                            style={{ width: `${avg}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </GlassPanel>

                                <GlassPanel className="rounded-2xl p-6 lg:col-span-2">
                                    <h3 className="text-lg font-bold mb-4">Jobs Overview</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {jobs.slice(0, 4).map((job) => (
                                            <div key={job.id} className="bg-white/5 rounded-xl p-4">
                                                <p className="font-medium truncate">{job.roleTitle}</p>
                                                <p className="text-white/40 text-sm">{job.interviewCount} candidates</p>
                                                <p className={cn("text-2xl font-bold mt-2", getScoreColor(job.avgScore))}>{job.avgScore || "-"}</p>
                                            </div>
                                        ))}
                                    </div>
                                </GlassPanel>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
