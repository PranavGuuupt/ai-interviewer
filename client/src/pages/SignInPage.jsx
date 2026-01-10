import React from "react";
import { SignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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

const SignInPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center relative overflow-hidden">
            <GridPattern />

            <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-[#ccff00] rounded-full blur-[180px] opacity-[0.05] pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-md px-4">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </button>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#ccff00] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(204,255,0,0.3)]">
                        <span className="text-black font-bold text-2xl font-mono">AI</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
                    <p className="text-white/40 mt-2">Sign in to access your recruiter dashboard</p>
                </div>

                <SignIn
                    appearance={{
                        elements: {
                            rootBox: "mx-auto",
                            card: "bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl",
                            headerTitle: "text-white",
                            headerSubtitle: "text-white/60",
                            socialButtonsBlockButton: "bg-white/10 border-white/20 text-white hover:bg-white/20",
                            formFieldLabel: "text-white/60",
                            formFieldInput: "bg-white/5 border-white/10 text-white",
                            footerActionLink: "text-[#ccff00] hover:text-[#b3e600]",
                            formButtonPrimary: "bg-[#ccff00] text-black hover:bg-[#b3e600]",
                            dividerLine: "bg-white/10",
                            dividerText: "text-white/40",
                        }
                    }}
                    redirectUrl="/dashboard"
                    signUpUrl="/sign-up"
                />
            </div>
        </div>
    );
};

export default SignInPage;
