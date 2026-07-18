import { useState } from "react";
import { FiLock, FiUser, FiX, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { FaHeartbeat } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function CMSLogin({
  setIsLoggedIn,
  setUser,
}) {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/auth/login", {
        email,
        password
      });

      if (response.data.success) {
        const user = response.data.user;
        setUser(user);
        setIsLoggedIn(true);

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(user));

        setShowPopup(true);
        setTimeout(() => {

          if (user.role === "super_admin") {
            navigate("/super-admin/dashboard");
          }
          else if (user.role === "admin") {
            navigate("/admin/dashboard");
          }
          else if (user.role === "doctor") {
            navigate("/doctor/dashboard");
          }
          else if (user.role === "staff") {
            navigate("/staff/dashboard");
          }
          else {
            setError("Unauthorized User");
          }
        }, 1200);
      }
    }
    catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      }
      else {
        setError("Server not responding.");
      }
    }
    finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-cover bg-center relative flex flex-col items-center justify-center px-4 -mt-8"
      style={{ backgroundImage: "url('https://imgs.search.brave.com/UZDCMjtvFnnQwffo_wAW8WPocbZyKdSxkv7AxHBGYik/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMTIv/NjAyLzc2NC9zbWFs/bC9hYnN0cmFjdC1i/bHVyLWhvc3BpdGFs/LWNvcnJpZG9yLWRl/Zm9jdXNlZC1tZWRp/Y2FsLWJhY2tncm91/bmQtcGhvdG8uanBn')" }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {showPopup && (
        <div className="absolute top-8 z-50 bg-[#0b645b] text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
          <FiCheckCircle /> <span className="text-sm font-bold">Logged in to CMS successfully!</span>
        </div>
      )}

      <div className="relative z-10 w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <button onClick={() => navigate("/")} className="absolute right-6 top-6 text-gray-300 hover:text-gray-600"><FiX size={20} /></button>
        <div className="flex justify-center mb-6"><div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center"><FaHeartbeat className="text-2xl text-[#0b645b]" /></div></div>
        <h1 className="text-center text-2xl font-black text-slate-900">CMS Portal</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-1 ml-1 block text-[9px] font-black uppercase text-gray-400">Email Address</label>
            <div className="flex items-center rounded-2xl border bg-gray-50 px-4 h-12"><FiUser className="text-gray-400" />
              <input required type="text" value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" className="ml-3 w-full bg-transparent outline-none text-xs" /></div>
          </div>
          <div>
            <label className="mb-1 ml-1 block text-[9px] font-black uppercase text-gray-400">Password</label>
            <div className="flex items-center rounded-2xl border bg-gray-50 px-4 h-12"><FiLock className="text-gray-400" />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="ml-3 w-full bg-transparent outline-none text-xs"
              /></div>
            {
              error &&
              <p className="text-red-500 text-xs">
                {error}
              </p>
            }
          </div>
          <button type="submit" className="flex h-12 w-full items-center justify-center rounded-2xl bg-[#0b645b] text-sm font-bold text-white hover:bg-[#084e46]">{
            loading ? "Logging in..." : "Login to CMS"
          }<FiArrowRight className="ml-2" /></button>
        </form>
      </div>

      {/* Switcher Line */}
      <div className="mt-6 z-10 rounded-full bg-slate-800/80 px-6 py-3 text-[11px] text-white backdrop-blur-sm">
        Are you a Patient? <Link to="/login" className="font-bold text-[#2dd4bf] hover:underline">Book an Appointment</Link>
      </div>
    </div>
  );
}