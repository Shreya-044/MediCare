import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiCheckCircle,
  FiX,
  FiAlertCircle,
  FiCalendar,
  FiUser,
  FiPhone,
  FiMail,
  FiLock,
  FiStar,
  FiClock,
} from "react-icons/fi";

export default function AppointmentForm() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [patientData, setPatientData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");

  const PLATFORM_FEE = 10;
  const GST_RATE = 0.05;

  const calculateTotal = (fee) =>
    ((fee + PLATFORM_FEE) * (1 + GST_RATE)).toFixed(2);

  const triggerPopup = (message, error = false) => {
    setPopupMessage(message);
    setIsError(error);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const handleBookAppointment = () => {
    if (
      !patientData.name ||
      !patientData.phone ||
      !patientData.email ||
      (!isLoggedIn && !patientData.password) ||
      !selectedSpecialty ||
      !selectedDate ||
      !selectedDoctor ||
      !selectedTime
    ) {
      triggerPopup("Please fill in all required fields.", true);
      return;
    }
    setIsLoggedIn(true);
    triggerPopup("Appointment booked & payment processed!");
    setTimeout(() => {
      navigate("/login"); 
    }, 2000);
  };

  const specialties = [
    { name: "General Practitioner", icon: "🩺" },
    { name: "Dental", icon: "🦷" },
    { name: "Orthopedics", icon: "🦴" },
    { name: "Pediatrics", icon: "👶" },
    { name: "Obstetrics Gynecology", icon: "👩‍🍼" },
    { name: "Cardiology", icon: "❤️" },
    { name: "Psychology", icon: "🧠" },
    { name: "Oncology", icon: "🔬" },
    { name: "ENT", icon: "👂" },
    { name: "Neurology", icon: "⚡" },
    { name: "Physiotherapy", icon: "🏃" },
    { name: "Radiology", icon: "☢️" },
  ];

  const availableDoctors = [
    {
      id: 1,
      name: "Dr. Smith",
      fee: 500,
      rating: 4.8,
      slots: ["09:00 AM", "10:00 AM", "02:00 PM"],
    },
    {
      id: 2,
      name: "Dr. Jones",
      fee: 750,
      rating: 4.5,
      slots: ["11:00 AM", "03:00 PM"],
    },
  ];

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 -mt-5">
      {showPopup && (
        <div
          className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 ${isError ? "bg-red-600" : "bg-[#0b645b]"} text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3`}
        >
          {isError ? <FiAlertCircle /> : <FiCheckCircle />}
          <span className="text-sm font-bold">{popupMessage}</span>
        </div>
      )}

      <div className="w-full bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100 relative">
        <button
          onClick={() => navigate("/")}
          className="absolute right-8 top-8 p-2 rounded-full hover:bg-slate-100 text-slate-400"
        >
          <FiX size={24} />
        </button>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-10">
          Confirm Appointment
        </h2>

        {/* Patient Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {[
            {
              key: "name",
              label: "Full Name",
              placeholder: "Your Name",
              icon: FiUser,
            },
            {
              key: "phone",
              label: "Phone Number",
              placeholder: "+91 XXX XXX XXXX",
              icon: FiPhone,
            },
            {
              key: "email",
              label: "Email Address",
              placeholder: "you@example.com",
              icon: FiMail,
            },
            {
              key: "password",
              label: "Password",
              placeholder: "••••••••",
              icon: FiLock,
            },
          ].map((f) => (
            <div key={f.key} className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-slate-400 ml-1">
                {f.label}
              </label>
              <div className="flex items-center bg-slate-50 border rounded-2xl px-4 py-3">
                <f.icon className="text-slate-400 mr-3" />
                <input
                  disabled={isLoggedIn && f.key !== "password"}
                  value={patientData[f.key]}
                  onChange={(e) =>
                    setPatientData({ ...patientData, [f.key]: e.target.value })
                  }
                  type={f.key === "password" ? "password" : "text"}
                  placeholder={f.placeholder}
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Specialties */}
        <div className="mb-12">
          <h3 className="text-xs font-bold text-slate-900 mb-6 uppercase tracking-widest">
            Select Specialty
          </h3>
          <div className="grid grid-cols-6 gap-3">
            {specialties.map((s) => (
              <button
                key={s.name}
                onClick={() => setSelectedSpecialty(s.name)}
                className={`flex flex-col items-center p-4 rounded-2xl border transition-all ${selectedSpecialty === s.name ? "border-teal-600 bg-teal-50 shadow-sm ring-1 ring-teal-600" : "border-slate-100 hover:border-slate-300 bg-white"}`}
              >
                <span className="text-2xl mb-1">{s.icon}</span>
                <span className="text-[10px] font-bold text-slate-700 text-center leading-tight">
                  {s.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Flow Panel */}
        {selectedSpecialty && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 animate-in fade-in">
            <div className="bg-slate-50 p-6 rounded-3xl border">
              <label className="text-[10px] font-bold uppercase text-slate-400 mb-4 flex gap-2">
                <FiCalendar /> Date
              </label>
              <input
                type="date"
                min={today}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-4 text-sm bg-white border rounded-2xl outline-none"
              />
            </div>
            <div className="space-y-4">
              {availableDoctors.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDoctor(d)}
                  className={`w-full p-5 rounded-3xl border text-left transition-all ${selectedDoctor?.id === d.id ? "border-teal-600 bg-teal-50" : "border-slate-200"}`}
                >
                  <div className="flex justify-between font-bold">
                    {d.name}{" "}
                    <span className="text-amber-500 text-xs flex items-center gap-1">
                      <FiStar fill="currentColor" /> {d.rating}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Fee: ₹{d.fee}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Selection Area */}
        {selectedDoctor && selectedDate && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 animate-in slide-in-from-bottom-4 duration-500">
            {/* Time Slots */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-6 flex items-center gap-2">
                <FiClock /> Select Time
              </p>
              <div className="flex gap-3 flex-wrap">
                {selectedDoctor.slots.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`px-6 py-3 rounded-xl text-[11px] font-bold border transition-all ${
                      selectedTime === t
                        ? "bg-teal-600 text-white border-teal-600 shadow-md"
                        : "bg-white border-slate-200 hover:border-teal-500"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-6">
                Payment Summary
              </p>
              <div className="text-[11px] text-slate-600 space-y-4">
                <div className="flex justify-between">
                  <span>Doctor Fee:</span>{" "}
                  <span className="font-bold text-slate-900">
                    ₹{selectedDoctor.fee}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee:</span>{" "}
                  <span className="font-bold text-slate-900">
                    ₹{PLATFORM_FEE}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-4">
                  <span>GST (5%):</span>{" "}
                  <span className="font-bold text-slate-900">
                    ₹
                    {((selectedDoctor.fee + PLATFORM_FEE) * GST_RATE).toFixed(
                      2,
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-black text-slate-900 text-sm pt-2">
                  <span>Total Payable:</span>{" "}
                  <span>₹{calculateTotal(selectedDoctor.fee)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-12">
          <button
            onClick={handleBookAppointment}
            className="px-12 py-4 bg-[#0b645b] text-white rounded-2xl font-black shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            {isLoggedIn
              ? `Pay ₹${selectedDoctor ? calculateTotal(selectedDoctor.fee) : "..."} & Confirm`
              : "Register & Pay"}
          </button>
        </div>
      </div>
    </div>
  );
}
