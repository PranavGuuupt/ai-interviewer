import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import LandingPage from './pages/LandingPage';
import CandidateFlow from './pages/CandidateFlow';
import Dashboard from './pages/Dashboard';
import RecruiterJobPage from './pages/RecruiterJobPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
    return (
        <>
            <SignedIn>{children}</SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    );
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />
                <Route path="/start" element={<CandidateFlow />} />
                <Route path="/interview/:jobId" element={<CandidateFlow />} />

                {/* Protected routes - Recruiters only */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/recruiter"
                    element={
                        <ProtectedRoute>
                            <RecruiterJobPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
