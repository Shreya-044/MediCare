import { useState, useEffect } from "react";
import { FiCalendar, FiClock, FiUser, FiAlertCircle, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import api from "../services/api";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentViewMonth, setCurrentViewMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Format date as YYYY-MM-DD for the API
    const formattedDate = selectedDate.toISOString().split("T")[0];
    fetchAppointments(formattedDate);
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

  // Calendar Helpers
  const changeMonth = (delta) => {
    setCurrentViewMonth(prev => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() + delta);
      return next;
    });
  };

  const getDaysInMonthGrid = () => {
    const year = currentViewMonth.getFullYear();
    const month = currentViewMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; 
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const daysArray = [];
    for (let i = 0; i < adjustedFirstDay; i++) {
      daysArray.push(null); 
    }
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(new Date(year, month, i));
    }
    return daysArray;
  };

  const isPastDate = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return day < today;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">My Appointments</h2>
          <p className="text-sm text-gray-500 font-medium">Manage your patient schedule.</p>
        </div>

        {/* Calendar Picker */}
        <div className="relative">
          <button 
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-100 shadow-sm text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
          >
            <FiCalendar className="text-[#0b645b]" /> 
            {selectedDate.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
          </button>

          {isCalendarOpen && (
            <div className="absolute top-full mt-2 right-0 w-80 p-6 bg-white border border-gray-100 rounded-3xl shadow-xl z-50">
              <div className="flex items-center justify-between mb-6">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-lg text-gray-600 hover:bg-gray-50 border"><FiChevronLeft /></button>
                <span className="text-sm font-black text-gray-900">
                  {currentViewMonth.toLocaleDateString("en-US", { month: 'long', year: 'numeric' })}
                </span>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-lg text-gray-600 hover:bg-gray-50 border"><FiChevronRight /></button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-gray-400 mb-2 uppercase">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <div key={i}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonthGrid().map((day, index) => {
                  if (!day) return <div key={index} />;
                  const isSelected = day.toDateString() === selectedDate.toDateString();
                  const isDisabled = isPastDate(day);
                  const isToday = day.toDateString() === new Date().toDateString();

                  return (
                    <button
                      key={day.toISOString()}
                      disabled={isDisabled}
                      onClick={() => { setSelectedDate(day); setIsCalendarOpen(false); }}
                      className={`h-9 w-9 rounded-xl flex items-center justify-center text-xs font-bold transition 
                        ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-teal-50 text-gray-700'}
                        ${isSelected ? 'bg-[#0b645b] text-white shadow-md' : ''}
                        ${isToday && !isSelected ? 'border-2 border-green-500' : ''}
                      `}
                    >
                      {day.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Appointments List */}
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
            <div key={appt._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-all">
              <div className="flex items-center gap-6">
                <div className="bg-[#0b645b]/10 p-4 rounded-full text-[#0b645b]">
                  <FiUser size={24} />
                </div>
                <div>
                  <p className="text-lg font-black text-gray-900">{appt.patient_name}</p>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{appt.patient_email}</p>
                  <p className="text-sm text-gray-500">{appt.patient_phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 font-bold text-gray-600">
                    <div className="flex items-center gap-2">
                        <FiClock className="text-[#0b645b]" />
                        {appt.appointment_time}
                    </div>
                    <p className="text-xs text-gray-400">{appt.appointment_date}</p>
                </div>
                <span
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${
                    appt.status === "Booked"
                      ? "bg-green-100 text-green-600"
                      : appt.status === "Completed"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
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