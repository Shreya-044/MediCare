import { Routes, Route, BrowserRouter } from "react-router-dom";
import { useState, useEffect } from "react";

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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [activeTab, setActiveTab] = useState("Home");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <main className="grow">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/login"
              element={
                <Login
                  onLogin={(loggedUser) => {
                    setIsLoggedIn(true);
                    setUser(loggedUser);
                  }}
                />
              }
            />

            <Route
              path="/cms-login"
              element={
                <CMSLogin
                  setIsLoggedIn={setIsLoggedIn}
                  setUser={setUser}
                />
              }
            />

            <Route
              path="/profile"
              element={
                <UserProfile
                  userName={user?.name}
                  userEmail={user?.email}
                />
              }
            />

            <Route
              path="/settings"
              element={
                <UserSettings
                  userName={user?.name}
                />
              }
            />

            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="/doctor/dashboard"
              element={<DoctorDashboard />}
            />

            <Route
              path="/staff/dashboard"
              element={<StaffDashboard />}
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;