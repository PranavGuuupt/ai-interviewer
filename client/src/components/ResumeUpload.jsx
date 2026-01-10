import React, { useState } from "react";
import {
    Upload,
    FileText,
    Loader2,
    CheckCircle,
    AlertCircle,
    X,
    ArrowUpRight,
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

const ResumeUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === "application/pdf") {
                setFile(droppedFile);
                setError(null);
            } else {
                setError("Please upload a PDF file");
            }
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type === "application/pdf") {
                setFile(selectedFile);
                setError(null);
            } else {
                setError("Please upload a PDF file");
            }
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file first");
            return;
        }

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("resume", file);

        try {
            const response = await axios.post("/api/resume/parse", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.success) {
                console.log("Resume parsed successfully:", response.data.data);
                onUploadSuccess(response.data.data);
            }
        } catch (err) {
            console.error("Upload error:", err);
            setError(
                err.response?.data?.message ||
                    "Failed to upload resume. Please try again."
            );
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full flex items-center justify-center p-4">
            <div className="max-w-xl w-full space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#ccff00]/10 border border-[#ccff00]/20 text-[#ccff00] mb-4 shadow-[0_0_30px_rgba(204,255,0,0.1)]">
                        <FileText className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-medium text-white tracking-tighter">
                        Upload{" "}
                        <span className="text-[#ccff00] font-serif italic">
                            Resume
                        </span>
                    </h1>
                    <p className="text-white/60 text-lg">
                        Our AI will analyze your experience to generate a
                        personalized interview session.
                    </p>
                </div>

                {/* Upload Area */}
                <GlassPanel className="rounded-[2rem] p-8 md:p-10 space-y-8">
                    <div
                        className={cn(
                            "relative group rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300",
                            dragActive
                                ? "border-[#ccff00] bg-[#ccff00]/5"
                                : file
                                ? "border-[#ccff00]/50 bg-[#ccff00]/5"
                                : "border-white/10 hover:border-white/20 hover:bg-white/5"
                        )}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            id="resume-upload"
                            accept=".pdf"
                            onChange={handleChange}
                            className="hidden"
                        />

                        <label
                            htmlFor="resume-upload"
                            className="cursor-pointer flex flex-col items-center gap-4 relative z-10"
                        >
                            {file ? (
                                <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                                    <div className="w-16 h-16 rounded-full bg-[#ccff00]/20 flex items-center justify-center mx-auto text-[#ccff00]">
                                        <CheckCircle className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-medium text-white">
                                            {file.name}
                                        </p>
                                        <p className="text-sm text-white/40 mt-1">
                                            {(file.size / 1024 / 1024).toFixed(
                                                2
                                            )}{" "}
                                            MB
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setFile(null);
                                        }}
                                        className="inline-flex items-center gap-1 text-xs font-mono text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest"
                                    >
                                        <X className="w-3 h-3" /> Remove File
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-white/40 group-hover:text-[#ccff00] group-hover:scale-110 transition-all duration-300">
                                        <Upload className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-medium text-white group-hover:text-[#ccff00] transition-colors">
                                            Drop your resume here
                                        </p>
                                        <p className="text-sm text-white/40 mt-1">
                                            or click to browse
                                        </p>
                                    </div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono text-white/40 uppercase tracking-wider">
                                        PDF Only
                                        <span className="w-1 h-1 rounded-full bg-white/20"></span>
                                        Max 5MB
                                    </div>
                                </div>
                            )}
                        </label>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-red-200 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Action Button */}
                    <button
                        onClick={handleUpload}
                        disabled={!file || isUploading}
                        className={cn(
                            "w-full py-4 rounded-xl font-bold text-lg tracking-wide flex items-center justify-center gap-2 transition-all duration-300",
                            !file || isUploading
                                ? "bg-white/5 text-white/20 cursor-not-allowed"
                                : "bg-[#ccff00] text-black hover:bg-[#b3e600] shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_30px_rgba(204,255,0,0.5)] transform hover:-translate-y-0.5"
                        )}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span className="font-mono">
                                    INITIALIZING...
                                </span>
                            </>
                        ) : (
                            <>
                                Start Interview
                                <ArrowUpRight className="w-5 h-5" />
                            </>
                        )}
                    </button>

                    {/* Footer Info */}
                    <div className="text-center">
                        <p className="text-xs text-white/30 font-mono">
                            SECURE PARSING PIPELINE V2.4 ACTIVE
                        </p>
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
};

export default ResumeUpload;
