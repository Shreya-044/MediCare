import { useState } from "react";
import { Link } from "react-router-dom";
import { FiLock, FiUser, FiX, FiArrowRight, FiCheckCircle, FiMail } from "react-icons/fi";
import { FaHeartbeat } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login(props) {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await api.post("/patient/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.patient)
      );

      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);

        if (props.onLogin) {
          props.onLogin(response.data.patient);
        }
        navigate("/dashboard");
      }, 1500);

    } catch (err) {
      console.log(err.response?.data);

      alert(err.response?.data?.message || "Login failed");
    }
  };
  return (
    <div className="min-h-screen bg-cover bg-center relative flex flex-col items-center justify-center px-4 -mt-8"
      style={{ backgroundImage: "url('https://imgs.search.brave.com/UZDCMjtvFnnQwffo_wAW8WPocbZyKdSxkv7AxHBGYik/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMTIv/NjAyLzc2NC9zbWFs/bC9hYnN0cmFjdC1i/bHVyLWhvc3BpdGFs/LWNvcnJpZG9yLWRl/Zm9jdXNlZC1tZWRp/Y2FsLWJhY2tncm91/bmQtcGhvdG8uanBn')" }}>

      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {showPopup && (
        <div className="absolute top-8 z-50 bg-[#0b645b] text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
          <FiCheckCircle className="text-lg" />
          <span className="text-sm font-bold">Successfully {isRegistering ? "registered" : "logged in"}!</span>
        </div>
      )}

      {/* Main container */}
      <div className="relative z-10 w-full max-w-sm flex flex-col gap-6">
        <div className="rounded-3xl bg-white p-8 shadow-2xl relative">
          <button onClick={() => navigate("/")} className="absolute right-6 top-6 text-gray-300 hover:text-gray-600">
            <FiX size={20} />
          </button>

          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center">
              <FaHeartbeat className="text-2xl text-[#0b645b]" />
            </div>
          </div>

          <h1 className="text-center text-2xl font-black text-slate-900">{isRegistering ? "Create Account" : "MediCare Patient"}</h1>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {isRegistering && (
              <div>
                <label className="mb-1 ml-1 block text-[9px] font-black uppercase text-gray-400">Full Name</label>
                <div className="flex items-center rounded-2xl border bg-gray-50 px-4 h-12">
                  <FiUser className="text-gray-400" />
                  <input required name="fullName" type="text" placeholder="Enter your full name" className="ml-3 w-full bg-transparent outline-none text-xs" />
                </div>
              </div>
            )}
            <div>
              <label className="mb-1 ml-1 block text-[9px] font-black uppercase text-gray-400">Email Address</label>
              <div className="flex items-center rounded-2xl border bg-gray-50 px-4 h-12">
                <FiMail className="text-gray-400" />
                <input required name="email" type="email" placeholder="Enter your email" className="ml-3 w-full bg-transparent outline-none text-xs" />
              </div>
            </div>
            <div>
              <label className="mb-1 ml-1 block text-[9px] font-black uppercase text-gray-400">Password</label>
              <div className="flex items-center rounded-2xl border bg-gray-50 px-4 h-12">
                <FiLock className="text-gray-400" />
                <input
                  required
                  name="password"
                  type="password"
                  minLength="8"
                  title="Must contain at least 8 characters, including 1 uppercase, 1 lowercase, 1 number, and 1 special symbol."
                  placeholder="Min 8 chars, 1 number, 1 symbol"
                  className="ml-3 w-full bg-transparent outline-none text-xs"
                />
              </div>
            </div>
            <button type="submit" className="flex h-12 w-full items-center justify-center rounded-2xl bg-[#0b645b] text-sm font-bold text-white hover:bg-[#084e46] transition">
              {isRegistering ? "Register" : "Login"} <FiArrowRight className="ml-2" />
            </button>
          </form>

          <div className="mt-6 text-center text-[11px] font-bold text-gray-500">
            {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
            <span onClick={() => setIsRegistering(!isRegistering)} className="cursor-pointer text-[#0b645b] underline">
              {isRegistering ? "Login" : "Register here"}
            </span>
          </div>
        </div>

        {/* CMS Switcher */}
        <div className="text-center">
          <div className="inline-block rounded-full bg-slate-800/80 px-6 py-3 text-[11px] text-white backdrop-blur-sm">
            Are you a Hospital Staff or Doctor? <Link to="/cms-login" className="font-bold text-[#2dd4bf] hover:underline">Log in to CMS</Link>
          </div>
        </div>
      </div>
    </div>
  );
}