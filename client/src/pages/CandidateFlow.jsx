import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import InterviewRoom from "../components/InterviewRoom";
import ResumeUpload from "../components/ResumeUpload";
import { Loader2, AlertCircle, Briefcase, ChevronLeft } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

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

const CandidateFlow = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [resumeData, setResumeData] = useState(null);
    const [jobData, setJobData] = useState(null);
    const [isLoadingJob, setIsLoadingJob] = useState(false);
    const [jobError, setJobError] = useState(null);

    // Fetch job details if jobId is present in URL
    useEffect(() => {
        if (jobId) {
            fetchJobDetails();
        }
    }, [jobId]);

    const fetchJobDetails = async () => {
        setIsLoadingJob(true);
        setJobError(null);

        try {
            const response = await axios.get(`/api/jobs/${jobId}`);

            if (response.data.success) {
                setJobData(response.data.data);
                console.log("💼 Job loaded:", response.data.data);
            }
        } catch (err) {
            console.error("Failed to load job:", err);
            setJobError(
                err.response?.data?.message || "Failed to load job details"
            );
        } finally {
            setIsLoadingJob(false);
        }
    };

    const handleUploadSuccess = (data) => {
        console.log("Resume uploaded successfully:", data);
        setResumeData(data);
    };

    // Shared Background Wrapper
    const BackgroundWrapper = ({ children }) => (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#ccff00] selection:text-black font-sans relative overflow-x-hidden">
            <GridPattern />

            {/* Ambient Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#ccff00] rounded-full blur-[180px] opacity-[0.05] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#10b981] rounded-full blur-[150px] opacity-[0.03] pointer-events-none"></div>

            <div className="relative z-10">{children}</div>
        </div>
    );

    // Loading job details
    if (jobId && isLoadingJob) {
        return (
            <BackgroundWrapper>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full border-4 border-[#ccff00]/20 border-t-[#ccff00] animate-spin mx-auto"></div>
                            <Loader2 className="w-8 h-8 text-[#ccff00] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                        </div>
                        <h2 className="text-2xl font-medium tracking-tight">
                            Loading Job Details...
                        </h2>
                        <p className="text-white/40 font-mono text-sm">
                            ESTABLISHING SECURE CONNECTION
                        </p>
                    </div>
                </div>
            </BackgroundWrapper>
        );
    }

    // Job loading error
    if (jobId && jobError) {
        return (
            <BackgroundWrapper>
                <div className="min-h-screen flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-[#111] rounded-[2rem] p-10 border border-white/10 text-center space-y-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-red-500/5 mix-blend-overlay"></div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-500/10 text-red-500 mb-6 border border-red-500/20">
                                <AlertCircle className="w-10 h-10" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-medium mb-3 text-white">
                                    Connection Failed
                                </h2>
                                <p className="text-white/40">{jobError}</p>
                            </div>
                            <button
                                onClick={() => navigate("/")}
                                className="w-full px-6 py-4 bg-white text-black rounded-xl font-bold hover:bg-[#ccff00] transition-colors mt-8"
                            >
                                Return to Homepage
                            </button>
                        </div>
                    </div>
                </div>
            </BackgroundWrapper>
        );
    }

    return (
        <BackgroundWrapper>
            {!resumeData ? (
                <div className="min-h-screen flex flex-col">
                    {/* Navigation */}
                    <div className="p-6 md:px-12 flex justify-between items-center">
                        <div
                            className="flex items-center gap-2 cursor-pointer group"
                            onClick={() => navigate("/")}
                        >
                            <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-[#ccff00]/10 group-hover:border-[#ccff00]/20 transition-colors">
                                <ChevronLeft className="w-5 h-5 text-white group-hover:text-[#ccff00]" />
                            </div>
                            <span className="text-sm font-mono text-white/60 group-hover:text-white transition-colors">
                                BACK
                            </span>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#ccff00] bg-[#ccff00]/5 px-3 py-1 rounded-full border border-[#ccff00]/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse"></span>
                            SYSTEM ONLINE
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center pb-20">
                        {jobData && (
                            <div className="max-w-xl mx-auto w-full mb-8 px-4">
                                <div className="bg-[#ccff00]/5 border border-[#ccff00]/20 rounded-xl p-4 flex items-center gap-4">
                                    <div className="p-2 bg-[#ccff00]/10 rounded-lg text-[#ccff00]">
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-[#ccff00] font-mono text-xs uppercase tracking-wider mb-1">
                                            Applying For
                                        </div>
                                        <div className="text-white font-medium text-lg">
                                            {jobData.roleTitle}
                                        </div>
                                    </div>
                                    <div className="ml-auto px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">
                                        {jobData.difficulty}
                                    </div>
                                </div>
                            </div>
                        )}
                        <ResumeUpload onUploadSuccess={handleUploadSuccess} />
                    </div>
                </div>
            ) : (
                <>
                    {/* Interview Header */}
                    <header className="border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
                        <div className="max-w-[1800px] mx-auto px-6 h-20 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-10 h-10 bg-[#ccff00] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(204,255,0,0.2)] cursor-pointer hover:scale-105 transition-transform"
                                    onClick={() => navigate("/")}
                                >
                                    <span className="text-black font-bold text-xl font-mono">
                                        AI
                                    </span>
                                </div>
                                <div className="hidden md:block h-6 w-[1px] bg-white/10"></div>
                                <div className="hidden md:block text-sm font-mono text-white/40">
                                    INTERVIEW SESSION
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                {jobData && (
                                    <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/5">
                                        <Briefcase className="w-4 h-4 text-[#ccff00]" />
                                        <span className="text-sm text-white/80">
                                            {jobData.roleTitle}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <div className="text-right hidden sm:block">
                                        <div className="text-xs text-white/40 font-mono uppercase">
                                            Candidate
                                        </div>
                                        <div className="text-sm font-medium text-white">
                                            {resumeData.fullName}
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ccff00] to-green-500 p-[1px]">
                                        <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center text-white font-bold">
                                            {resumeData.fullName.charAt(0)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="container mx-auto py-8 px-4 md:px-8">
                        <InterviewRoom
                            resumeData={resumeData}
                            jobId={jobId}
                            jobRole={jobData?.roleTitle}
                            jobDescription={jobData?.jobDescription}
                            difficulty={jobData?.difficulty}
                            duration={jobData?.duration}
                        />
                    </main>
                </>
            )}
        </BackgroundWrapper>
    );
};

export default CandidateFlow;
