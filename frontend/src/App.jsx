import { useUser } from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "./context/UserContext";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import HostDashboardPage from "./pages/HostDashboardPage";
import CandidateDashboardPage from "./pages/CandidateDashboardPage";
import ResumeDashboardPage from "./pages/ResumeDashboardPage";
import ResumeBuilderPage from "./pages/ResumeBuilderPage";
import ResumePreviewPage from "./pages/ResumePreviewPage";
import ATSAnalysisPage from "./pages/ATSAnalysisPage";
import ATSUploadPage from "./pages/ATSUploadPage";
import ATSReportDetailsPage from "./pages/ATSReportDetailsPage";
import ProblemsPage from "./pages/ProblemsPage";
import ProblemPage from "./pages/ProblemPage";
import SessionPage from "./pages/SessionPage";
import HistoryPage from "./pages/HistoryPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import FeedbackPage from "./pages/FeedbackPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to="/" />} />
        <Route path="/host-dashboard" element={isSignedIn ? <HostDashboardPage /> : <Navigate to="/" />} />
        <Route path="/candidate-dashboard" element={isSignedIn ? <CandidateDashboardPage /> : <Navigate to="/" />} />

        {/* Resume & ATS Module Routes */}
        <Route path="/resume" element={isSignedIn ? <ResumeDashboardPage /> : <Navigate to="/" />} />
        <Route path="/resume/builder/:resumeId" element={isSignedIn ? <ResumeBuilderPage /> : <Navigate to="/" />} />
        <Route path="/resume/view/:resumeId" element={<ResumePreviewPage />} />
        
        {/* ATS Resume Analyzer Routes */}
        <Route path="/ats-analysis" element={isSignedIn ? <ATSAnalysisPage /> : <Navigate to="/" />} />
        <Route path="/ats-analysis/upload" element={isSignedIn ? <ATSUploadPage /> : <Navigate to="/" />} />
        <Route path="/ats-analysis/report/:id" element={isSignedIn ? <ATSReportDetailsPage /> : <Navigate to="/" />} />
        <Route path="/ats" element={isSignedIn ? <ATSAnalysisPage /> : <Navigate to="/" />} />

        {/* Interview Platform Routes */}
        <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to="/" />} />
        <Route path="/problem/:id" element={isSignedIn ? <ProblemPage /> : <Navigate to="/" />} />
        <Route path="/session/:id" element={isSignedIn ? <SessionPage /> : <Navigate to="/" />} />

        <Route path="/history" element={isSignedIn ? <HistoryPage /> : <Navigate to="/" />} />
        <Route path="/analytics" element={isSignedIn ? <AnalyticsPage /> : <Navigate to="/" />} />
        <Route path="/feedback" element={isSignedIn ? <FeedbackPage /> : <Navigate to="/" />} />
        <Route path="/profile" element={isSignedIn ? <ProfilePage /> : <Navigate to="/" />} />
        <Route path="/settings" element={isSignedIn ? <SettingsPage /> : <Navigate to="/" />} />
      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </UserProvider>
  );
}

export default App;
