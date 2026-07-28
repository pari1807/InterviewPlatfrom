import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";
import RoleSelectionModal from "../RoleSelectionModal";
import axios from "../../lib/axios";

export function AppLayout({ children, onCreateSession, fullWidth = false }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dbUser, setDbUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await axios.get("/users/me");
      if (res.data?.user) {
        setDbUser(res.data.user);
        if (res.data.user.role === "pending") {
          setShowRoleModal(true);
        }
      }
    } catch (err) {
      console.log("Error fetching DB user:", err.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">
        <TopHeader
          onOpenSidebar={() => setSidebarOpen(true)}
          onCreateSession={onCreateSession}
          userRole={dbUser?.role}
          candidateId={dbUser?.candidateId}
        />

        <main className={`flex-1 ${fullWidth ? "p-0" : "p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto"}`}>
          {children}
        </main>
      </div>

      {/* Role Selection Modal on First Login */}
      <RoleSelectionModal
        isOpen={showRoleModal}
        userCandidateId={dbUser?.candidateId}
        onRoleSelected={(updatedUser) => {
          setDbUser(updatedUser);
          setShowRoleModal(false);
        }}
      />
    </div>
  );
}
