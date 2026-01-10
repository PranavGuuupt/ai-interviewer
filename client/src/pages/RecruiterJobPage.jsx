import React, { useState, useRef, useEffect } from "react";
import {
    Briefcase,
    Copy,
    CheckCircle,
    Loader2,
    Sparkles,
    ArrowLeft,
    ChevronDown,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "framer-motion";

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

const CustomSelect = ({
    label,
    value,
    options,
    onChange,
    name,
    icon: Icon,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div className="relative" ref={containerRef}>
            <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-3 ml-1">
                {label}
            </label>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full px-6 py-4 bg-white/5 border rounded-2xl text-lg text-white flex items-center justify-between cursor-pointer transition-all",
                    isOpen
                        ? "border-[#ccff00]/50 bg-white/10"
                        : "border-white/10 hover:border-white/20"
                )}
            >
                <span className="truncate">
                    {selectedOption?.label || "Select..."}
                </span>
                <div className="flex items-center gap-3 text-white/40">
                    {Icon && <Icon className="w-4 h-4" />}
                    <ChevronDown
                        className={cn(
                            "w-4 h-4 transition-transform",
                            isOpen && "rotate-180"
                        )}
                    />
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-full mt-2 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2"
                    >
                        {options.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => {
                                    onChange({
                                        target: { name, value: option.value },
                                    });
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "px-6 py-3 cursor-pointer text-sm transition-colors flex items-center justify-between group",
                                    value === option.value
                                        ? "bg-white/5 text-[#ccff00]"
                                        : "text-white/70 hover:bg-[#ccff00]/10 hover:text-[#ccff00]"
                                )}
                            >
                                {option.label}
                                {value === option.value && (
                                    <CheckCircle className="w-4 h-4 text-[#ccff00]" />
                                )}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const RecruiterJobPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        roleTitle: "",
        jobDescription: "",
        difficulty: "Medium",
        duration: "Standard (30 min)",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [jobId, setJobId] = useState(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await axios.post("/api/jobs/create", formData);

            if (response.data.success) {
                setJobId(response.data.data.id);
                console.log("✅ Job created:", response.data.data);
            }
        } catch (err) {
            console.error("Job creation error:", err);
            setError(
                err.response?.data?.message ||
                    "Failed to create job. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const magicLink = jobId
        ? `${window.location.origin}/interview/${jobId}`
        : "";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(magicLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCreateAnother = () => {
        setJobId(null);
        setFormData({
            roleTitle: "",
            jobDescription: "",
            difficulty: "Medium",
            duration: "Standard (30 min)",
        });
        setCopied(false);
    };

    const difficultyOptions = [
        { value: "Easy", label: "Easy - Entry Level" },
        { value: "Medium", label: "Medium - Mid-Level" },
        { value: "Hard", label: "Hard - Senior Level" },
    ];

    const durationOptions = [
        { value: "Short (15 min)", label: "Short (15 min)" },
        { value: "Standard (30 min)", label: "Standard (30 min)" },
        { value: "Deep Dive (60 min)", label: "Deep Dive (60 min)" },
    ];

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
                            onClick={() => navigate("/dashboard")}
                            className="flex items-center gap-2 cursor-pointer group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#ccff00]/50 transition-colors">
                                <ArrowLeft className="w-4 h-4 text-white group-hover:text-[#ccff00]" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-sm tracking-wider uppercase text-white/40">
                            <span className="w-2 h-2 rounded-full bg-[#ccff00]"></span>
                            New Job Post
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-6 py-20 relative z-10">
                {!jobId ? (
                    <>
                        <div className="text-center mb-12">
                            <h1 className="text-5xl font-medium tracking-tighter text-white mb-4">
                                Create{" "}
                                <span className="text-[#ccff00] font-serif italic">
                                    Job
                                </span>{" "}
                                Position
                            </h1>
                            <p className="text-white/60 text-lg">
                                Configure the AI constraints for this role.
                            </p>
                        </div>

                        <GlassPanel className="rounded-[2.5rem] p-10 md:p-12">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Role Title */}
                                <div>
                                    <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-3 ml-1">
                                        Role Title
                                    </label>
                                    <input
                                        type="text"
                                        name="roleTitle"
                                        value={formData.roleTitle}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g., Senior React Developer"
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-lg text-white placeholder-white/20 focus:outline-none focus:border-[#ccff00]/50 focus:bg-white/10 transition-all"
                                    />
                                </div>

                                {/* Job Description */}
                                <div>
                                    <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-3 ml-1">
                                        Job Description
                                    </label>
                                    <textarea
                                        name="jobDescription"
                                        value={formData.jobDescription}
                                        onChange={handleInputChange}
                                        required
                                        rows={6}
                                        placeholder="Describe the role requirements, responsibilities, and required skills..."
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-lg text-white placeholder-white/20 focus:outline-none focus:border-[#ccff00]/50 focus:bg-white/10 transition-all resize-none"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Difficulty */}
                                    <CustomSelect
                                        label="Difficulty"
                                        name="difficulty"
                                        value={formData.difficulty}
                                        options={difficultyOptions}
                                        onChange={handleInputChange}
                                        icon={Briefcase}
                                    />

                                    {/* Duration */}
                                    <CustomSelect
                                        label="Duration"
                                        name="duration"
                                        value={formData.duration}
                                        options={durationOptions}
                                        onChange={handleInputChange}
                                        icon={Briefcase}
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                        <p className="text-red-300 text-sm">
                                            {error}
                                        </p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={cn(
                                        "w-full py-5 rounded-2xl font-bold text-lg tracking-wide flex items-center justify-center gap-3 transition-all mt-4",
                                        isSubmitting
                                            ? "bg-white/5 text-white/20 cursor-not-allowed"
                                            : "bg-[#ccff00] text-black hover:bg-[#b3e600] shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_30px_rgba(204,255,0,0.5)] transform hover:-translate-y-0.5"
                                    )}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span className="font-mono text-sm uppercase">
                                                Processing...
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            Generate Interview Link
                                        </>
                                    )}
                                </button>
                            </form>
                        </GlassPanel>
                    </>
                ) : (
                    <>
                        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/20 text-[#ccff00] mb-8 shadow-[0_0_50px_rgba(204,255,0,0.15)]">
                                <CheckCircle className="w-12 h-12" />
                            </div>
                            <h1 className="text-5xl font-medium tracking-tighter text-white mb-4">
                                Link{" "}
                                <span className="text-[#ccff00] font-serif italic">
                                    Generated
                                </span>
                            </h1>
                            <p className="text-white/60 text-lg">
                                Share this secure link with candidates to begin.
                            </p>
                        </div>

                        <GlassPanel className="rounded-[2.5rem] p-10 space-y-8 animate-in zoom-in-95 duration-500 delay-150">
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-widest text-[#ccff00] mb-3 ml-1">
                                    Magic Link
                                </label>
                                <div className="bg-black/40 border border-[#ccff00]/30 rounded-2xl p-2 pl-6 flex items-center justify-between gap-4 group hover:border-[#ccff00] transition-colors">
                                    <code className="text-white font-mono text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                                        {magicLink}
                                    </code>
                                    <button
                                        onClick={copyToClipboard}
                                        className={cn(
                                            "px-6 py-3 rounded-xl font-bold text-sm tracking-wide flex items-center gap-2 transition-all shadow-lg",
                                            copied
                                                ? "bg-white text-black"
                                                : "bg-[#ccff00] text-black hover:bg-[#b3e600]"
                                        )}
                                    >
                                        {copied ? (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                Copied
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4" />
                                                Copy
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 pt-8 border-t border-white/5">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="text-xs text-white/40 uppercase tracking-widest mb-1">
                                        Role
                                    </div>
                                    <div className="text-lg font-medium text-white">
                                        {formData.roleTitle}
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="text-xs text-white/40 uppercase tracking-widest mb-1">
                                        Level
                                    </div>
                                    <div className="text-lg font-medium text-white">
                                        {formData.difficulty}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={handleCreateAnother}
                                    className="flex-1 py-4 border border-white/10 hover:bg-white/5 text-white rounded-xl font-medium transition-all"
                                >
                                    Create Another
                                </button>
                                <button
                                    onClick={() =>
                                        window.open(magicLink, "_blank")
                                    }
                                    className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                                >
                                    Test Link{" "}
                                    <ArrowLeft className="w-4 h-4 rotate-180" />
                                </button>
                            </div>
                        </GlassPanel>
                    </>
                )}
            </div>
        </div>
    );
};

export default RecruiterJobPage;
