import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    Menu,
    Sparkles,
    ArrowUpRight,
    Play,
    Cpu,
    Hexagon,
    Globe,
    ArrowRight,
    Mic,
    FileText,
    BarChart3,
    CheckCircle,
    Brain,
} from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utility ---
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// --- Components ---

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

const PillButton = ({ children, className, variant = "outline", onClick }) => {
    const variants = {
        outline:
            "border border-white/20 text-white hover:bg-white/10 hover:border-white/40",
        solid: "bg-[#ccff00] text-black hover:bg-[#b3e600] border border-[#ccff00] shadow-[0_0_20px_rgba(204,255,0,0.4)] hover:shadow-[0_0_30px_rgba(204,255,0,0.6)]",
        ghost: "bg-transparent text-white hover:bg-white/5",
    };

    return (
        <button
            onClick={onClick}
            className={cn(
                "px-6 py-3 rounded-full text-sm font-medium tracking-wide transition-all duration-300 font-sans flex items-center gap-2",
                variants[variant],
                className
            )}
        >
            {children}
        </button>
    );
};

const NavLink = ({ children, onClick }) => (
    <button
        onClick={onClick}
        className="px-5 py-2 rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all text-sm font-medium backdrop-blur-md"
    >
        {children}
    </button>
);

const SectionLabel = ({ children, color = "lime" }) => (
    <div
        className={cn(
            "inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest mb-8",
            color === "lime"
                ? "border-[#ccff00]/30 text-[#ccff00] bg-[#ccff00]/5"
                : "border-[#052e16]/20 text-[#052e16] bg-[#052e16]/5"
        )}
    >
        <span
            className={cn(
                "w-1.5 h-1.5 rounded-full animate-pulse",
                color === "lime" ? "bg-[#ccff00]" : "bg-[#052e16]"
            )}
        ></span>
        {children}
    </div>
);

const GridPattern = () => (
    <div className="absolute inset-0 z-0 pointer-events-none">
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

const LandingPage = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const scrollRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: scrollRef,
        offset: ["start start", "end end"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <div
            ref={scrollRef}
            className="md:p-4 lg:p-6 min-h-screen w-full flex flex-col items-center text-slate-900 bg-[#0a0a0a] font-sans selection:bg-[#ccff00] selection:text-black overflow-x-hidden"
        >
            {/* Scroll Progress Bar */}
            <motion.div
                style={{ scaleX: smoothProgress }}
                className="fixed top-0 left-0 right-0 h-1 bg-[#ccff00] origin-left z-[100] mix-blend-difference"
            />

            {/* Main Container */}
            <div className="relative w-full max-w-[1800px] bg-[#0c0c0c] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-white/10 flex flex-col min-h-screen">
                {/* === HERO SECTION === */}
                <div className="relative w-full min-h-[95vh] bg-[#050505] flex flex-col overflow-hidden">
                    <GridPattern />

                    {/* Ambient Glows */}
                    <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#ccff00] rounded-full blur-[180px] opacity-[0.05] pointer-events-none"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#10b981] rounded-full blur-[150px] opacity-[0.05] pointer-events-none"></div>

                    {/* Navigation */}
                    <nav className="relative z-50 px-6 md:px-12 py-8 flex justify-between items-center w-full">
                        {/* Logo Area */}
                        <div
                            className="flex items-center gap-3 group cursor-pointer"
                            onClick={() => navigate("/")}
                        >
                            <div className="w-10 h-10 bg-[#ccff00] rounded-xl flex items-center justify-center relative overflow-hidden shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-transform group-hover:rotate-12">
                                <div className="absolute inset-0 bg-black/10 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
                                <span className="text-black font-bold text-xl font-mono">
                                    AI
                                </span>
                            </div>
                            <span className="text-white font-bold tracking-tight text-lg hidden sm:block">
                                INTERVIEWER
                                <span className="text-[#ccff00]">.</span>
                            </span>
                        </div>

                        {/* Desktop Links */}
                        <div className="hidden lg:flex items-center gap-2 bg-white/5 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
                            <NavLink onClick={() => navigate("/")}>
                                Home
                            </NavLink>
                            <NavLink onClick={() => navigate("/dashboard")}>
                                Recruiters
                            </NavLink>
                            <NavLink onClick={() => window.scrollTo(0, 1000)}>
                                Features
                            </NavLink>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center text-white/50 text-xs font-mono gap-2 mr-2">
                                <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse"></span>
                                V1.0 LIVE
                            </div>
                            <button
                                onClick={() => navigate("/start")}
                                className="hidden sm:flex bg-white text-black px-5 py-2.5 rounded-full font-bold text-sm hover:bg-[#ccff00] transition-colors duration-300"
                            >
                                Start Interview
                            </button>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors lg:hidden"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                        </div>
                    </nav>

                    {/* Hero Content */}
                    <div className="flex-1 flex flex-col justify-center px-6 md:px-12 relative z-10 pt-10 pb-20">
                        <div className="max-w-[90vw] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                            {/* Left: Typography */}
                            <div className="col-span-12 lg:col-span-7">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.8,
                                        ease: [0.16, 1, 0.3, 1],
                                    }}
                                >
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ccff00]/20 bg-[#ccff00]/5 text-[#ccff00] text-xs font-mono mb-8">
                                        <Sparkles className="w-3 h-3" />
                                        <span>
                                            AI-POWERED INTERVIEW PRACTICE
                                        </span>
                                    </div>

                                    <h1 className="text-6xl md:text-8xl xl:text-[7rem] leading-[0.9] font-medium text-white tracking-tighter mb-8">
                                        Crack Your <br />
                                        <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] via-[#ecfccb] to-white italic font-serif pr-4 py-2">
                                            Interview
                                            <svg
                                                className="absolute w-full h-3 bottom-4 left-0 text-[#ccff00] -z-10 opacity-60"
                                                viewBox="0 0 100 10"
                                                preserveAspectRatio="none"
                                            >
                                                <path
                                                    d="M0 5 Q 50 10 100 5"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    fill="none"
                                                />
                                            </svg>
                                        </span>
                                        Today.
                                    </h1>

                                    <p className="text-white/60 text-lg md:text-xl font-light max-w-xl leading-relaxed mb-10">
                                        Experience realistic AI interviews
                                        tailored to your resume. Get instant
                                        feedback on your technical skills,
                                        communication, and confidence.
                                    </p>

                                    <div className="flex flex-wrap gap-4">
                                        <PillButton
                                            variant="solid"
                                            className="group"
                                            onClick={() => navigate("/start")}
                                        >
                                            Start Interview
                                            <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                                        </PillButton>
                                        <PillButton
                                            variant="outline"
                                            onClick={() =>
                                                navigate("/dashboard")
                                            }
                                        >
                                            <Brain className="w-4 h-4 mr-2" />{" "}
                                            Recruiter Dashboard
                                        </PillButton>
                                    </div>

                                    <div className="mt-16 flex items-center gap-8 text-white/30">
                                        <div className="h-[1px] w-12 bg-white/20"></div>
                                        <div className="flex gap-6 items-center">
                                            <span className="text-sm font-mono uppercase tracking-widest text-[#ccff00]">
                                                Powered By
                                            </span>
                                            <div className="flex gap-4">
                                                <span className="text-sm font-mono uppercase tracking-widest hover:text-white transition-colors">
                                                    GROQ
                                                </span>
                                                <span className="text-sm font-mono uppercase tracking-widest hover:text-white transition-colors">
                                                    EDGE-TTS
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Right: Visual */}
                            <div className="col-span-12 lg:col-span-5 relative">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                    className="relative aspect-[4/5] md:aspect-square lg:aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 bg-[#111] shadow-2xl group"
                                >
                                    {/* UI Mockup Container */}
                                    <div className="absolute inset-0 bg-[#0a0a0a] p-6 flex flex-col">
                                        {/* Fake Browser Header */}
                                        <div className="h-8 flex items-center gap-2 mb-4 opacity-50">
                                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                        </div>

                                        {/* Visual Interface Preview */}
                                        <div className="flex-1 bg-[#151515] rounded-xl border border-white/5 relative overflow-hidden group-hover:border-[#ccff00]/30 transition-colors duration-500 flex flex-col items-center justify-center">
                                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>

                                            {/* Audio Waveform Animation Mockup */}
                                            <div className="flex items-center gap-1 h-12 mb-8">
                                                {[...Array(10)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-2 bg-[#ccff00] rounded-full animate-[bounce_1s_infinite]"
                                                        style={{
                                                            height: `${Math.random() *
                                                                100
                                                                }% `,
                                                            animationDelay: `${i * 0.1
                                                                } s`,
                                                        }}
                                                    ></div>
                                                ))}
                                            </div>

                                            <div className="text-center z-10 p-6 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 max-w-[80%]">
                                                <p className="text-[#ccff00] font-mono text-sm mb-2">
                                                    AI INTERVIEWER
                                                </p>
                                                <p className="text-white text-lg font-medium">
                                                    "Tell me about a time you
                                                    solved a complex problem."
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* === FEATURES GRID (BENTO) === */}
                <section className="bg-[#0c0c0c] px-6 md:px-12 py-24 relative z-20">
                    <div className="max-w-[1600px] mx-auto">
                        <div className="mb-20 max-w-2xl">
                            <SectionLabel color="lime">
                                System Architecture
                            </SectionLabel>
                            <h2 className="text-4xl md:text-6xl font-medium text-white tracking-tighter mb-6">
                                Built for the{" "}
                                <span className="text-[#ccff00] font-serif italic">
                                    ambitious
                                </span>
                                .
                            </h2>
                            <p className="text-white/60 text-xl font-light">
                                A complete ecosystem designed to accelerate your
                                career growth from resume to offer.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 grid-rows-2 gap-6 h-auto min-h-[800px]">
                            {/* Feature 1: Resume Analysis (Large) */}
                            <div className="col-span-1 md:col-span-2 row-span-2 bg-[#111] rounded-[2rem] border border-white/10 p-8 md:p-12 relative overflow-hidden group hover:border-[#ccff00]/50 transition-colors duration-500">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative z-10 h-full flex flex-col justify-between">
                                    <div>
                                        <div className="w-14 h-14 bg-[#ccff00]/10 rounded-2xl flex items-center justify-center text-[#ccff00] mb-8 border border-[#ccff00]/20">
                                            <FileText className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-3xl text-white font-medium mb-4">
                                            Resume Intelligence
                                        </h3>
                                        <p className="text-white/50 text-lg max-w-md leading-relaxed">
                                            Our advanced parsing engine extracts
                                            your skills, experience, and
                                            projects to generate
                                            hyper-personalized interview
                                            questions.
                                        </p>
                                    </div>

                                    {/* Visualization */}
                                    <div className="mt-12 w-full h-64 bg-black/50 rounded-xl border border-white/10 overflow-hidden relative">
                                        <div className="absolute inset-0 p-4 font-mono text-xs text-white/20 overflow-hidden leading-relaxed">
                                            {`{
    "candidate": {
        "skills": ["React", "Node.js", "System Design"],
            "experience_years": 4,
                "projects": [
                    { "name": "E-commerce", "tech": "MERN" }
                ]
    },
    "generated_questions": [
        "Explain the reconciliation process in React.",
        "How would you scale a MongoDB database?"
    ]
} `}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                                            <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full w-2/3 bg-[#ccff00]"></div>
                                            </div>
                                            <span className="text-xs font-mono text-[#ccff00]">
                                                PARSING
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Feature 2: Detailed Reports (Tall) */}
                            <div className="col-span-1 md:col-span-1 row-span-2 bg-[#151515] rounded-[2rem] border border-white/10 p-8 relative overflow-hidden group hover:bg-[#1a1a1a] transition-colors">
                                <div className="absolute top-0 right-0 p-8">
                                    <BarChart3 className="text-white/20 w-6 h-6 group-hover:text-[#ccff00] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                                </div>
                                <div className="h-full flex flex-col">
                                    <div className="mt-auto mb-8">
                                        <Hexagon className="w-12 h-12 text-[#ccff00] mb-6 stroke-1" />
                                        <h3 className="text-2xl text-white font-medium mb-2">
                                            Detailed Analytics
                                        </h3>
                                        <p className="text-white/50 text-sm">
                                            Receive a comprehensive score on
                                            technical skills, communication, and
                                            confidence.
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                            {
                                                label: "Technical",
                                                val: "8.5/10",
                                            },
                                            {
                                                label: "Communication",
                                                val: "9/10",
                                            },
                                            {
                                                label: "Confidence",
                                                val: "7/10",
                                            },
                                        ].map((stat, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 text-xs font-mono text-white/70"
                                            >
                                                <span>{stat.label}</span>
                                                <span className="text-[#ccff00]">
                                                    {stat.val}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Feature 3: Voice (Wide Short) */}
                            <div className="col-span-1 md:col-span-1 lg:col-span-1 bg-[#1a1a1a] rounded-[2rem] border border-white/10 p-8 flex flex-col justify-center items-center text-center group relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                                <div className="relative z-10">
                                    <Mic className="w-8 h-8 text-[#ccff00] mx-auto mb-4" />
                                    <div className="text-3xl font-bold text-white mb-2">
                                        Realistic
                                    </div>
                                    <p className="text-[#ccff00] text-sm font-mono uppercase tracking-widest">
                                        Voice Interaction
                                    </p>
                                </div>
                            </div>

                            {/* Feature 4: Standard Card */}
                            <div className="col-span-1 md:col-span-1 lg:col-span-1 bg-[#0f0f0f] rounded-[2rem] border border-white/10 p-8 flex flex-col justify-between group hover:border-white/20 transition-colors">
                                <Globe className="w-10 h-10 text-white/80 mb-4" />
                                <div>
                                    <h3 className="text-xl text-white font-medium mb-2">
                                        Remote Ready
                                    </h3>
                                    <p className="text-white/50 text-sm">
                                        Practice anytime, anywhere. 100% Free.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* === LIGHT SECTION (Methodology / How It Works) === */}
                <section className="bg-[#e5e5e5] w-full px-6 md:px-12 py-24 rounded-t-[3rem] relative z-30">
                    <div className="max-w-[1600px] mx-auto">
                        <SectionLabel color="dark">How It Works</SectionLabel>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
                            <div>
                                <h2 className="text-5xl md:text-7xl font-medium text-black tracking-tighter leading-[0.95] mb-12">
                                    Practice makes{" "}
                                    <span className="text-[#166534] font-serif italic">
                                        perfect
                                    </span>
                                    .
                                </h2>

                                <div className="space-y-8">
                                    {[
                                        {
                                            title: "Upload Resume",
                                            desc: "Share your resume (PDF) so our AI can understand your background.",
                                        },
                                        {
                                            title: "Interview",
                                            desc: "Answer voice-based questions tailored to your profile and the job role.",
                                        },
                                        {
                                            title: "Feedback",
                                            desc: "Get instant, detailed feedback on your performance and areas to improve.",
                                        },
                                    ].map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex gap-6 group cursor-pointer"
                                        >
                                            <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-[#ccff00] transition-colors duration-300 text-lg font-mono">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-black mb-2">
                                                    {item.title}
                                                </h3>
                                                <p className="text-black/60 leading-relaxed max-w-md">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                <div className="aspect-[4/5] rounded-full bg-black overflow-hidden relative shadow-2xl">
                                    <img
                                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2776&auto=format&fit=crop"
                                        alt="Interview"
                                        className="w-full h-full object-cover grayscale opacity-80 hover:scale-105 transition-transform duration-700"
                                    />

                                    {/* Floating Quote */}
                                    <div className="absolute bottom-12 left-12 right-12 bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl">
                                        <p className="text-white text-lg font-medium italic mb-4">
                                            "It felt like a real interview. The
                                            feedback on my communication style
                                            was incredibly valuable."
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-[#ccff00] rounded-full"></div>
                                            <span className="text-white/80 text-sm font-mono uppercase">
                                                Alex M., Software Engineer
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* === FOOTER === */}
                <footer className="bg-black text-white px-6 md:px-12 pt-24 pb-12">
                    <div className="max-w-[1600px] mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
                            <div>
                                <h2 className="text-[10vw] lg:text-[8rem] font-bold tracking-tighter leading-none text-white/10 select-none">
                                    READY?
                                </h2>
                            </div>
                            <div className="flex flex-col justify-end items-start lg:items-end">
                                <h3 className="text-4xl md:text-5xl font-medium mb-8 max-w-lg text-left lg:text-right">
                                    Land your dream job with confidence.
                                </h3>
                                <button
                                    onClick={() => navigate("/start")}
                                    className="group relative px-8 py-4 bg-[#ccff00] text-black rounded-full font-bold text-lg overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        Start Practice Interview{" "}
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                </button>
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <div className="flex flex-wrap gap-8 text-sm text-white/40">
                                <a
                                    href="#"
                                    className="hover:text-[#ccff00] transition-colors"
                                >
                                    Privacy Policy
                                </a>
                                <a
                                    href="#"
                                    className="hover:text-[#ccff00] transition-colors"
                                >
                                    Terms of Service
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;
