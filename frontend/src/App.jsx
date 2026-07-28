import { useUser } from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import HostDashboardPage from "./pages/HostDashboardPage";
import CandidateDashboardPage from "./pages/CandidateDashboardPage";
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
    <>
      <Routes>
        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to="/" />} />
        <Route path="/host-dashboard" element={isSignedIn ? <HostDashboardPage /> : <Navigate to="/" />} />
        <Route path="/candidate-dashboard" element={isSignedIn ? <CandidateDashboardPage /> : <Navigate to="/" />} />

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
    </>
  );
}

export default App;
