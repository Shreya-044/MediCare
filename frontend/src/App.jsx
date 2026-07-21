import { Routes, Route, BrowserRouter, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "./services/api";
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
import AppointmentForm from "./pages/AppointmentForm";
import { useLocation } from "react-router-dom";
import PatientDashboard from "./pages/PatientDashboard";
import PatientAppointment from "./pages/PatientAppointment";
import PatientReport from "./pages/PatientReport";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorPatientFiles from "./pages/DoctorPatientFiles";
import LiveQueue from "./pages/LiveQueue";
import { LoadingProvider } from "./context/LoadingContext";
import Loader from "./components/Loader";

function AppContent() {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [activeTab, setActiveTab] = useState("Dashboard");
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("hospitals")) setActiveTab("Hospitals");
    else if (path.includes("admins")) setActiveTab("Admins");
    else if (path.includes("revenue")) setActiveTab("Revenue");
    else if (path.includes("appointments")) setActiveTab("My Appointments");
    else if (path.includes("reports")) setActiveTab("My Reports");
    else if (path === "/dashboard") setActiveTab("Dashboard");
    else if (path === "/") setActiveTab("Home");
    else setActiveTab("Dashboard");
  }, [location]);

  const handleSuperAdminNav = (tab) => {
    setActiveTab(tab);
    const paths = {
      Dashboard: "/super-admin/dashboard",
      Hospitals: "/super-admin/hospitals",
      Admins: "/super-admin/admins",
      Revenue: "/super-admin/revenue",
    };
    navigate(paths[tab]);
  };

  useEffect(() => {
    if (user?.role === "super_admin") {
      fetchHospitals();
    }
  }, [user]);

  const handleAdminNav = (tab) => {
    setActiveTab(tab);
    const paths = {
      Dashboard: "/admin/dashboard",
      Doctors: "/admin/doctors",
      Staff: "/admin/staff",
      Patients: "/admin/patients",
    };
    navigate(paths[tab]);
  };

  const fetchHospitals = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/super-admin/hospitals", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setHospitals(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        user={user}
      />
      <LoadingProvider>
        <Loader />
        <main className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                <Login
                  onLogin={(u) => {
                    setIsLoggedIn(true);
                    setUser(u);
                  }}
                />
              }
            />
            <Route
              path="/cms-login"
              element={
                <CMSLogin setIsLoggedIn={setIsLoggedIn} setUser={setUser} />
              }
            />
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
            <Route
              path="/settings"
              element={<UserSettings userName={user?.name} />}
            />
            <Route
              path="/super-admin/:tab"
              element={
                <SuperAdminDashboard
                  activeTab={activeTab}
                  hospitals={hospitals}
                  fetchHospitals={fetchHospitals}
                  onNavigate={handleSuperAdminNav}
                />
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <AdminDashboard
                  activeTab="Dashboard"
                  onNavigate={handleAdminNav}
                />
              }
            />
            <Route
              path="/admin/doctors"
              element={
                <AdminDashboard
                  activeTab="Doctors"
                  onNavigate={handleAdminNav}
                />
              }
            />
            <Route
              path="/admin/staff"
              element={
                <AdminDashboard activeTab="Staff" onNavigate={handleAdminNav} />
              }
            />
            <Route
              path="/admin/patients"
              element={
                <AdminDashboard
                  activeTab="Patients"
                  onNavigate={handleAdminNav}
                />
              }
            />
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route
              path="/doctor/appointments"
              element={<DoctorAppointments />}
            />
            <Route
              path="/doctor/patient-files"
              element={<DoctorPatientFiles />}
            />
            <Route path="/staff/dashboard" element={<StaffDashboard />} />
            <Route
              path="/appointment/:hospitalId"
              element={<AppointmentForm />}
            />

            <Route
              path="/dashboard"
              element={
                <PatientDashboard
                  activeTab="Dashboard"
                  onNavigate={(tab) => {
                    if (tab === "My Appointments") navigate("/appointments");
                    else if (tab === "My Reports") navigate("/reports");
                    else navigate("/dashboard");
                  }}
                />
              }
            />
            <Route path="//appointment/:id/live" element={<LiveQueue />} />
            <Route path="/appointments" element={<PatientAppointment />} />
            <Route path="/reports" element={<PatientReport />} />
          </Routes>
        </main>
        <Footer />
      </LoadingProvider>
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
