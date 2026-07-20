import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
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
  const { hospitalId } = useParams();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [patientData, setPatientData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
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

  const isSlotExpired = (time) => {
    if (selectedDate !== new Date().toISOString().split("T")[0]) return false;
    const [hours, minutes] = time.split(/[: ]/);
    const slotDate = new Date();
    let h = parseInt(hours);
    if (time.includes("PM") && h !== 12) h += 12;
    if (time.includes("AM") && h === 12) h = 0;

    slotDate.setHours(h, parseInt(minutes), 0);
    return slotDate < new Date();
  };

  const handleBookAppointment = async () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const requestBody = {
      name: patientData.name,
      email: patientData.email,
      phone: patientData.phone,
      dob: patientData.dob,
      gender: patientData.gender,
      doctor_id: selectedDoctor._id,
      appointment_date: selectedDate,
      appointment_time: selectedTime,
      consultation_fee: selectedDoctor.consultation_fee,
      platform_fee: PLATFORM_FEE,
      gst: (selectedDoctor.consultation_fee + PLATFORM_FEE) * GST_RATE,
      total_amount: Number(calculateTotal(selectedDoctor.consultation_fee)),
    };

    if (!isLoggedIn) requestBody.password = patientData.password;

    if (
      !patientData.name || !patientData.phone || !patientData.email ||
      !patientData.dob || !patientData.gender || (!isLoggedIn && !patientData.password) ||
      !selectedSpecialty || !selectedDate || !selectedDoctor || !selectedTime
    ) {
      triggerPopup("Please fill in all required fields.", true);
      return;
    }

    if (!isLoggedIn && !passwordRegex.test(patientData.password)) {
      triggerPopup("Password must be 8+ chars with uppercase, lowercase, number, and symbol.", true);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/patient/book-appointment", requestBody, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      triggerPopup(response.data.message);
      setTimeout(() => navigate(isLoggedIn ? "/appointments" : "/login"), 2000);
    } catch (err) {
      triggerPopup(err.response?.data?.message || "Something went wrong.", true);
    }
  };

  const specialties = [
    { name: "General Practitioner", icon: "🩺" }, { name: "Dental", icon: "🦷" },
    { name: "Orthopedics", icon: "🦴" }, { name: "Pediatrics", icon: "👶" },
    { name: "Obstetrics Gynecology", icon: "👩‍🍼" }, { name: "Cardiology", icon: "❤️" },
    { name: "Psychology", icon: "🧠" }, { name: "Oncology", icon: "🔬" },
    { name: "ENT", icon: "👂" }, { name: "Neurology", icon: "⚡" },
    { name: "Physiotherapy", icon: "🏃" }, { name: "Radiology", icon: "☢️" },
  ];

  const [availableDoctors, setAvailableDoctors] = useState([]);
  const filteredDoctors = availableDoctors.filter((doctor) => doctor.department === selectedSpecialty);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (hospitalId) fetchDoctors();
  }, [hospitalId]);

  const fetchDoctors = async () => {
    try {
      const response = await api.get(`/hospital/${hospitalId}/doctors`);
      if (response.data.success) setAvailableDoctors(response.data.data);
    } catch (err) { console.log(err); }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (token && user) {
      setIsLoggedIn(true);
      setPatientData({
        name: user.name || "", phone: user.phone || "", email: user.email || "",
        password: "", dob: user.dob || "", gender: user.gender || "",
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {showPopup && (
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-auto ${isError ? "bg-red-600" : "bg-[#0b645b]"} text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3`}>
          {isError ? <FiAlertCircle /> : <FiCheckCircle />}
          <span className="text-sm font-bold">{popupMessage}</span>
        </div>
      )}

      <div className="max-w-5xl mx-auto bg-white p-6 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100 relative">
        <button onClick={() => navigate("/")} className="absolute right-6 top-6 p-2 rounded-full hover:bg-slate-100 text-slate-400">
          <FiX size={24} />
        </button>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-8">Confirm Appointment</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {[
            { key: "name", label: "Full Name", placeholder: "Your Name", icon: FiUser, type: "text" },
            { key: "phone", label: "Phone Number", placeholder: "+91 XXX XXX XXXX", icon: FiPhone, type: "text" },
            { key: "email", label: "Email Address", placeholder: "you@example.com", icon: FiMail, type: "email" },
            { key: "password", label: "Password", placeholder: "Min 8 chars, 1 number, 1 symbol", icon: FiLock, type: "password" },
            { key: "dob", label: "Date of Birth", placeholder: "", icon: FiCalendar, type: "date" },
            { key: "gender", label: "Gender", placeholder: "", icon: FiUser, type: "select", options: ["Male", "Female", "Other"] },
          ]
            .filter((f) => !(isLoggedIn && f.key === "password"))
            .map((f) => (
              <div key={f.key} className="flex items-center bg-slate-50 border rounded-2xl px-4 py-3">
                <f.icon className="text-slate-400 mr-3" />
                {f.type === "select" ? (
                  <select disabled={isLoggedIn} value={patientData[f.key]} onChange={(e) => setPatientData({ ...patientData, [f.key]: e.target.value })} className="w-full bg-transparent outline-none text-sm">
                    <option value="">Select Gender</option>
                    {f.options.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                ) : (
                  <input disabled={isLoggedIn && f.key !== "password"} value={patientData[f.key]} onChange={(e) => setPatientData({ ...patientData, [f.key]: e.target.value })} type={f.type} placeholder={f.placeholder} className="w-full bg-transparent outline-none text-sm" />
                )}
              </div>
            ))}
        </div>

        <div className="mb-10">
          <h3 className="text-xs font-bold text-slate-900 mb-6 uppercase tracking-widest">Select Specialty</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {specialties.map((s) => (
              <button key={s.name} onClick={() => setSelectedSpecialty(s.name)} className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${selectedSpecialty === s.name ? "border-teal-600 bg-teal-50" : "border-slate-100 hover:border-slate-300"}`}>
                <span className="text-xl mb-1">{s.icon}</span>
                <span className="text-[9px] font-bold text-slate-700 text-center">{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        {selectedSpecialty && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-slate-50 p-6 rounded-3xl border">
              <label className="text-[10px] font-bold uppercase text-slate-400 mb-4 flex gap-2"><FiCalendar /> Date</label>
              <input type="date" min={today} onChange={(e) => setSelectedDate(e.target.value)} className="w-full p-4 text-sm bg-white border rounded-2xl outline-none" />
            </div>
            <div className="space-y-3">
              {filteredDoctors.map((d) => (
                <button key={d._id} onClick={() => setSelectedDoctor(d)} className={`w-full p-4 rounded-3xl border text-left ${selectedDoctor?._id === d._id ? "border-teal-600 bg-teal-50" : "border-slate-200"}`}>
                  <div className="flex justify-between font-bold text-sm">{d.name} <span className="text-amber-500 text-xs flex items-center gap-1"><FiStar fill="currentColor" /> {d.rating}</span></div>
                  <div className="text-[11px] text-slate-500">{d.designation}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedDoctor && selectedDate && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-slate-50 p-6 rounded-3xl border">
              <p className="text-[10px] font-bold uppercase text-slate-400 mb-4 flex items-center gap-2"><FiClock /> Select Time</p>
              <div className="flex gap-2 flex-wrap">
                {selectedDoctor.available_slots?.map((t) => (
                  <button key={t} disabled={isSlotExpired(t)} onClick={() => setSelectedTime(t)} className={`px-4 py-2 rounded-xl text-[11px] font-bold border ${isSlotExpired(t) ? "bg-slate-200 text-slate-400" : selectedTime === t ? "bg-teal-600 text-white" : "bg-white"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border shadow-sm">
              <p className="text-[10px] font-bold uppercase text-slate-400 mb-4">Payment Summary</p>
              <div className="space-y-2 text-sm font-bold">
                <div className="flex justify-between"><span>Doctor Fee:</span> <span>₹{selectedDoctor.consultation_fee}</span></div>
                <div className="flex justify-between"><span>Platform Fee:</span> <span>₹{PLATFORM_FEE}</span></div>
                <div className="flex justify-between border-t pt-2 mt-2"><span>Total:</span> <span>₹{calculateTotal(selectedDoctor.consultation_fee)}</span></div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-10">
          <button onClick={handleBookAppointment} className="w-full md:w-auto px-12 py-4 bg-[#0b645b] text-white rounded-2xl font-black shadow-lg">
            {isLoggedIn ? `Pay & Confirm` : "Register & Pay"}
          </button>
        </div>
      </div>
    </div>
  );
}