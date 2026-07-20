import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  FiUser,
  FiSettings,
  FiLogOut,
  FiUserCheck,
} from "react-icons/fi";

const Navbar = ({ isLoggedIn, setIsLoggedIn, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (tabName) => {
    const path = location.pathname;

    const tabPathMap = {
      "Home": "/dashboard",
      "Dashboard": "/dashboard",
      "My Appointments": "/appointments",
      "My Reports": "/reports",
      "Hospitals": "/super-admin/hospitals",
      "Admins": "/super-admin/admins",
      "Revenue": "/super-admin/revenue",
      "Doctors": "/admin/doctors",
      "Staff": "/admin/staff",
      "Patients": "/admin/patients",
      "Appointments": "/doctor/appointments",
      "Patient Files": "/doctor/patient-files"
    };

    return path === tabPathMap[tabName] || (tabName === "Dashboard" && path.includes("dashboard"));
  };
  const [dropdown, setDropdown] = useState(false);
  const loggedInUser =
  user || JSON.parse(localStorage.getItem("user") || "null");
  const role = loggedInUser?.role;
  console.log("Navbar user:", loggedInUser);
  console.log("LocalStorage user:", localStorage.getItem("user"));
  console.log("isLoggedIn:", isLoggedIn);
  const userName = loggedInUser?.name ?? "User";
  let tabs = [];

  if (role === "super_admin") {
    tabs = [
      "Dashboard",
      "Hospitals",
      "Admins",
      "Revenue",
    ];
  } else if (role === "admin") {
    tabs = [
      "Dashboard",
      "Doctors",
      "Staff",
      "Patients",
    ];
  } else if (role === "doctor") {
    tabs = [
      "Dashboard",
      "Appointments",
      "Patient Files",
    ];
  } else if (role === "staff") {
    tabs = [
      "Dashboard",
      "Appointments",
    ];
  } else {
    tabs = [
      "Home",
      "My Appointments",
      "My Reports",
    ];
  }
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setDropdown(false);
    if (
      role === "super_admin" ||
      role === "admin" ||
      role === "doctor" ||
      role === "staff"
    ) {
      navigate("/cms-login");
    } else {
      navigate("/");
    }
  };

  const handleNavigation = (tab) => {
    if (role === "super_admin") {
      switch (tab) {
        case "Dashboard":
          navigate("/super-admin/dashboard");
          break;
        case "Hospitals":
          navigate("/super-admin/hospitals");
          break;
        case "Admins":
          navigate("/super-admin/admins");
          break;
        case "Revenue":
          navigate("/super-admin/revenue");
          break;
        default:
          navigate("/super-admin/dashboard");
      }
    } else if (role === "admin") {
      switch (tab) {
        case "Dashboard": navigate("/admin/dashboard"); break;
        case "Doctors": navigate("/admin/doctors"); break;
        case "Staff": navigate("/admin/staff"); break;
        case "Patients": navigate("/admin/patients"); break;
        default: navigate("/admin/dashboard");
      }
    } else if (role === "doctor") {
      switch (tab) {
        case "Dashboard":
          navigate("/doctor/dashboard");
          break;
        case "Appointments":
          navigate("/doctor/appointments");
          break;
        case "Patient Files":
          navigate("/doctor/patient-files");
          break;
        default:
          navigate("/doctor/dashboard");
      }
    } else if (role === "staff") {
      switch (tab) {
        case "Dashboard":
          navigate("/staff/dashboard");
          break;
        case "Appointments":
          navigate("/staff/appointments");
          break;
        default:
          navigate("/staff/dashboard");
      }
    } else {
      switch (tab) {
        case "Home":
          navigate("/dashboard");
          break;
        case "My Appointments":
          navigate("/appointments");
          break;
        case "My Reports":
          navigate("/reports");
          break;
        default:
          navigate("/dashboard");
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b-2 border-gray-100">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-10">
        {/* Logo */}
        <div className="flex flex-col cursor-pointer" onClick={() => navigate("/")}>
          <h1 className="text-xl font-black text-[#0b645b]">
            {role === "super_admin" ||
              role === "admin" ||
              role === "doctor" ||
              role === "staff"
              ? "MediCare CMS"
              : "MediCare Portals"}
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            {role === "super_admin" ||
              role === "admin" ||
              role === "doctor" ||
              role === "staff"
              ? "Hospital Management System"
              : "Doctor Appointment & Live Queue"}
          </p>
        </div>

        {isLoggedIn ? (
          <>
            {/* Navigation */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-full">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleNavigation(tab)}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition ${isActive(tab)
                    ? "bg-[#0b645b] text-white shadow-md"
                    : "text-gray-500 hover:text-gray-900"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* User Dropdown */}
            <div className="relative">
              <button onClick={() => setDropdown(!dropdown)}
                className="flex items-center gap-2 p-1 bg-gray-100 rounded-full hover:bg-gray-200 transition"
              >
                <div className="bg-[#0b645b] p-2 rounded-full">
                  <FiUserCheck className="text-white text-sm" />
                </div>
                <div className="pr-3 text-left">
                  <p className="text-xs font-bold text-[#0b645b]">
                    {userName}
                  </p>
                  <p className="text-[10px] uppercase text-gray-500">
                    {role?.replace("_", " ")}
                  </p>
                </div>
              </button>

              {dropdown && (
                <div className="absolute right-0 mt-3 w-52 bg-white rounded-3xl shadow-2xl border border-gray-100 p-2 z-50">
                  <button onClick={() => {
                    setDropdown(false);
                    navigate("/profile");
                  }}
                    className="flex items-center w-full px-4 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded-xl transition"
                  >
                    <FiUser className="mr-3 text-[#0b645b]" />
                    User Profile
                  </button>

                  <button
                    onClick={() => {
                      setDropdown(false);
                      navigate("/settings");
                    }}
                    className="flex items-center w-full px-4 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded-xl"
                  >
                    <FiSettings className="mr-3 text-[#0b645b]" />
                    User Settings
                  </button>

                  <div className="border-t border-gray-100 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl"
                  >
                    <FiLogOut className="mr-3" />
                    Logout
                  </button>

                </div>
              )}
            </div>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-[#0b645b] px-6 py-2 rounded-lg font-bold text-white text-[12px] hover:bg-[#084e46]"
          >
            SIGN IN / LOG IN
          </Link>
        )}
      </div>
    </header>
  );
};
export default Navbar;