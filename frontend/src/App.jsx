import { Routes, Route, BrowserRouter } from "react-router-dom";
import { useState } from "react";
import Navbar from "../src/components/Navbar";
import Home from "../src/pages/Home";
import Login from "../src/pages/Login";
import Footer from "../src/components/Footer";
import CMSLogin from "./pages/CMSLogin";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import UserSettings from "./pages/UserSettings";
import DoctorHome from "./pages/DoctorHome";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: "", email: "" });
  const [activeTab, setActiveTab] = useState("Home");

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar 
          isLoggedIn={isLoggedIn} 
          setIsLoggedIn={setIsLoggedIn} 
          userName={user.name} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
        <main className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={(name, email) => { setIsLoggedIn(true); setUser({ name, email }); }} />} />
            <Route path="/dashboard" element={<Dashboard activeTab={activeTab} />} />
            <Route path="/cms-login" element={<CMSLogin />} />
            <Route path="/profile" element={<UserProfile userName={user.name} userEmail={user.email} />} />
            <Route path="/settings" element={<UserSettings userName={user.name}/>} />
            <Route path="/doctor-home" element={<DoctorHome />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;