import { Routes, Route, BrowserRouter, useNavigate } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import CMSLogin from "./pages/CMSLogin";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import UserProfile from "./pages/UserProfile";
import UserSettings from "./pages/UserSettings";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";

function AppContent() {
  const navigate = useNavigate();
  
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || { name: "", email: "", role: "" });
  const [activeTab, setActiveTab] = useState(() => {
    const path = window.location.pathname;
    if (path.includes("hospitals")) return "Hospitals";
    if (path.includes("admins")) return "Admins";
    if (path.includes("revenue")) return "Revenue";
    return "Dashboard";
  });

  const handleSuperAdminNav = (tab) => {
    setActiveTab(tab);
    const paths = {
      Dashboard: "/super-admin/dashboard",
      Hospitals: "/super-admin/hospitals",
      Admins: "/super-admin/admins",
      Revenue: "/super-admin/revenue"
    };
    navigate(paths[tab]);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        user={user}
        activeTab={activeTab}
        setActiveTab={handleSuperAdminNav}
      />

      <main className="grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={(u) => { setIsLoggedIn(true); setUser(u); }} />} />
          <Route path="/cms-login" element={<CMSLogin setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
          <Route
            path="/profile"
            element={
              <UserProfile
                userName={user?.name}
                userEmail={user?.email}
                userRole={user?.role}
              />
            }
          />
          <Route path="/settings" element={<UserSettings userName={user?.name} />} />
          <Route path="/super-admin/:tab" element={<SuperAdminDashboard activeTab={activeTab} onNavigate={handleSuperAdminNav} />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}