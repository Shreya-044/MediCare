import { useState, useEffect } from "react";
import { FiCalendar, FiClock, FiUser, FiAlertCircle } from "react-icons/fi";
import api from "../services/api";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchAppointments(selectedDate);
  }, [selectedDate]);

  const fetchAppointments = async (date) => {
    setLoading(true);
    try {
      const response = await api.get(`/doctor/appointments?date=${date}`);
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900">My Appointments</h2>
          <p className="text-sm text-gray-500 font-medium">Manage your patient schedule.</p>
        </div>
        
        <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
          <FiCalendar className="text-[#0b645b] ml-2" />
          <input 
            type="date" 
            min={today}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-sm font-bold bg-transparent outline-none p-2"
          />
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-center py-10 text-gray-400 font-bold">Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-3xl">
            <FiAlertCircle className="mx-auto text-gray-300 mb-3" size={32} />
            <p className="text-gray-400 font-bold">No appointments for this date.</p>
          </div>
        ) : (
          appointments.map((appt) => (
            <div key={appt._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
              <div className="flex items-center gap-6">
                <div className="bg-[#0b645b]/10 p-4 rounded-full text-[#0b645b]">
                  <FiUser size={24} />
                </div>
                <div>
                  <p className="text-lg font-black text-gray-900">{appt.patient_name}</p>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{appt.patient_email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2 font-bold text-gray-600">
                  <FiClock className="text-[#0b645b]" />
                  {appt.appointment_time}
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${
                  appt.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {appt.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}