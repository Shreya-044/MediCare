import { useState, useEffect } from "react";
import api from "../services/api";
import {
  FiUsers,
  FiClock,
  FiCalendar,
  FiDollarSign,
  FiUser,
  FiLogIn,
  FiLogOut,
  FiFileText,
  FiTrendingUp,
  FiCheck,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

export default function DoctorHome() {
  const [activeTab, setActiveTab] = useState("Queue");
  const [queue, setQueue] = useState([]);
  const [isDoctorLive, setIsDoctorLive] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [newLeave, setNewLeave] = useState({
    date: "",
    reason: "",
    type: "Sick",
  });
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState(null);
  const [dailyLogs, setDailyLogs] = useState([]);

  // State for selected date and current viewed month/year
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentViewMonth, setCurrentViewMonth] = useState(new Date());

  // State for calendar visibility
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  const [salary, setSalary] = useState({
    monthly_income: 0,
    all_time_income: 0,
    total_deduction: 0,
    early_logout_count: 0,
    leave_count: 0,
    early_logout_deduction: 0,
    leave_deduction: 0,
  });

  useEffect(() => {
    fetchQueue(selectedDate);
    fetchAttendance();
    fetchLeaves();
    fetchSalary();

    const interval = setInterval(() => {
      fetchQueue(selectedDate);
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedDate]);

  // -- Queue Date Logic --

  const isToday = (d) => {
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const isPastDate = (d) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return d < now;
  };

  const changeMonth = (delta) => {
    setCurrentViewMonth((prev) => {
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

  const fetchQueue = async (date) => {
    try {
      const formattedDate =
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")
        }-${String(date.getDate()).padStart(2, "0")
        }`;
      const response = await api.get(`/queue?date=${formattedDate}`);

      if (response.data.success) {
        const formattedQueue = response.data.data.map((item, index) => ({
          _id: item._id,
          queue_number: item.queue_number,
          name: item.patient_name,
          time: item.appointment_time,
          status: index === 0 ? "Visiting" : index === 1 ? "Next" : "Pending",
        }));
        setQueue(formattedQueue);
      } else {
        setQueue([]);
      }
    } catch (err) {
      console.log(err);
      setQueue([]);
    }
  };

  // -- End Queue Date Logic --

  const fetchAttendance = async () => {
    try {
      const response = await api.get("/doctor/attendance");

      if (response.data.success) {
        setDailyLogs(response.data.data);

        setIsPunchedIn(response.data.is_punched_in);
        setIsDoctorLive(response.data.is_punched_in);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchLeaves = async () => {
    try {
      const response = await api.get("/leave");
      if (response.data.success) {
        setLeaveRequests(response.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSalary = async () => {
    try {
      const response = await api.get("/salary");
      if (response.data.success) {
        setSalary(response.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const response = await api.put(
        `/doctor/appointment/${appointmentId}/complete`
      );

      if (response.data.success) {
        fetchQueue(selectedDate);
      }
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Unable to complete appointment");
    }
  };

  const noShowAppointment = async (appointmentId) => {
    try {
      const response = await api.put(
        `/doctor/appointment/${appointmentId}/no-show`
      );

      if (response.data.success) {
        fetchQueue(selectedDate);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Unable to mark No Show");
    }
  };

  const handlePunchIn = async () => {
    try {
      const response = await api.post("/punch-in");
      if (response.data.success) {
        setPunchInTime(new Date());
        setIsDoctorLive(true);
        setIsPunchedIn(true);
        alert("Punched In Successfully");
        fetchAttendance();
      }
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Punch In Failed");
    }
  };

  const handlePunchOut = async () => {
    try {
      const response = await api.post("/punch-out");
      if (response.data.success) {
        setIsDoctorLive(false);
        setIsPunchedIn(false);
        fetchAttendance();
        alert("Punched Out Successfully");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Punch Out Failed");
    }
  };

  const submitLeave = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/leave", newLeave);
      if (response.data.success) {
        alert(response.data.message);
        setNewLeave({ date: "", reason: "", type: "Sick" });
        fetchLeaves();
      }
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const tabs = [
    { name: "Queue", icon: <FiUsers /> },
    { name: "Attendance", icon: <FiClock /> },
    { name: "Leave", icon: <FiCalendar /> },
    { name: "Salary", icon: <FiDollarSign /> },
  ];

  const today = new Date().toISOString().split("T")[0];

  const hasPunchedToday = dailyLogs.some(
    (log) => log.date === today
  );

  const daysInGrid = getDaysInMonthGrid();
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-10 py-6 md:py-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl font-black text-gray-900">Doctor Dashboard</h2>
        <div
          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 ${isDoctorLive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          <div
            className={`w-2 h-2 rounded-full ${isDoctorLive ? "bg-green-500" : "bg-red-500"}`}
          ></div>
          {isDoctorLive ? "Doctor Available" : "Doctor Unavailable"}
        </div>
      </div>

      <div className="flex gap-2 md:gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => {
              setActiveTab(tab.name);
              setCurrentPage(1);
            }}
            className={`flex items-center whitespace-nowrap gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition ${activeTab === tab.name
              ? "bg-[#0b645b] text-white shadow-lg shadow-[#0b645b]/20"
              : "bg-white text-gray-400 hover:bg-gray-50 border border-gray-100"
              }`}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      <div className="bg-white p-4 md:p-8 rounded-3xl border border-gray-100 shadow-sm min-h-[400px]">
        {activeTab === "Queue" && (
          <div className="space-y-8">
            <div>
              {/* Header with View Calendar button */}
              <div className="relative flex justify-between items-center mb-4">
                <h3 className="font-black text-gray-900 text-base md:text-lg">
                  Queue
                </h3>
                <button
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  className="flex items-center gap-2 text-xs font-bold text-[#0b645b] bg-[#0b645b]/10 px-4 py-2 rounded-xl hover:bg-[#0b645b]/20 transition-all"
                >
                  <FiCalendar /> {isCalendarOpen ? "Close" : "Select Date"}
                </button>

                {/* Conditional Popup Calendar */}
                {isCalendarOpen && (
                  <div className="absolute top-12 right-0 w-full max-w-sm p-6 bg-white border border-gray-100 rounded-3xl shadow-xl z-50">
                    <div className="flex items-center justify-between mb-6">
                      <button
                        onClick={() => changeMonth(-1)}
                        className="p-2 rounded-lg text-gray-600 hover:bg-gray-50 border border-gray-100"
                      >
                        <FiChevronLeft />
                      </button>
                      <span className="text-sm font-black text-gray-900">
                        {currentViewMonth.toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <button
                        onClick={() => changeMonth(1)}
                        className="p-2 rounded-lg text-gray-600 hover:bg-gray-50 border border-gray-100"
                      >
                        <FiChevronRight />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-gray-500 mb-2">
                      {weekDays.map((day) => (
                        <div key={day}>{day}</div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {daysInGrid.map((day, index) => {
                        if (!day)
                          return (
                            <div
                              key={`empty-${index}`}
                              className="bg-transparent"
                            ></div>
                          );
                        const isSelected =
                          day.toDateString() === selectedDate.toDateString();
                        const isDisabled = isPastDate(day);
                        const isTodayDate = isToday(day);

                        return (
                          <button
                            key={day.toISOString()}
                            disabled={isDisabled}
                            onClick={() => {
                              setSelectedDate(day);
                              setIsCalendarOpen(false);
                            }}
                            className={`
                              h-10 rounded-xl flex items-center justify-center text-sm font-bold
                              transition-all duration-150
                              ${isDisabled ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-teal-50"}
                              ${isSelected ? "!bg-[#0b645b] text-white shadow-md" : ""}
                              ${isTodayDate && !isSelected ? "border-2 border-[#0b645b] text-[#0b645b]" : ""}
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
              <div>
                <h3 className="font-black text-gray-900 mb-4 text-sm">
                  Appointments for{" "}
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                {queue.length === 0 ? (
                  <p className="text-sm text-gray-400 py-6 text-center bg-gray-50 rounded-2xl">
                    No patients scheduled.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {queue.map((p) => (
                      <div
                        key={p._id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-gray-200 gap-4"
                      >
                        <div>
                          <p className="font-bold text-gray-900">
                            Queue #{p.queue_number} - {p.name}
                          </p>
                          <p
                            className={`text-[10px] uppercase font-bold ${p.status === "Visiting" ? "text-green-600" : p.status === "Next" ? "text-orange-600" : "text-gray-400"}`}
                          >
                            {p.status} • {p.time}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => completeAppointment(p._id)}
                            disabled={!isDoctorLive}
                            className={`p-2 rounded-xl ${isDoctorLive ? "bg-green-50 text-green-600 hover:bg-green-100" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                          >
                            <FiCheck />
                          </button>
                          <button
                            onClick={() => noShowAppointment(p._id)}
                            disabled={!isDoctorLive}
                            className={`p-2 rounded-xl ${isDoctorLive ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                          >
                            <FiX />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {activeTab === "Attendance" && (
          <div className="max-w-4xl mx-auto py-4 animate-in fade-in duration-500">
            <div className="text-center mb-10">
              <h3 className="font-black text-2xl text-gray-900 mb-2">
                Shift Tracking
              </h3>
              <p className="text-sm text-gray-400 font-medium">
                Manage your daily work hours and logs
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button
                onClick={handlePunchIn}
                disabled={isPunchedIn || hasPunchedToday}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-lg active:scale-95 ${isPunchedIn || hasPunchedToday
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-transparent"
                  : "bg-[#0b645b] text-white hover:bg-[#0b645b]/90 border-2 border-transparent"
                  }`}
              >
                <FiLogIn /> Punch In
              </button>
              <button
                onClick={handlePunchOut}
                disabled={!isPunchedIn}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-lg active:scale-95 ${!isPunchedIn
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-red-500 text-white hover:bg-red-600"
                  }`}
              >
                <FiLogOut /> Punch Out
              </button>
            </div>

            <div className="w-full">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-black text-gray-900 text-lg">
                  Recent Shift Logs
                </h4>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {dailyLogs.length} Entries
                </span>
              </div>

              {dailyLogs.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {dailyLogs
                      .slice((currentPage - 1) * 3, currentPage * 3)
                      .map((log, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-gray-400 uppercase">
                                Date
                              </span>
                              <span className="font-bold text-gray-900 text-sm">
                                {log.date}
                              </span>
                            </div>
                            <span
                              className={`px-2 py-1 text-[9px] font-black uppercase rounded-lg ${log.punch_out ? "bg-gray-100 text-gray-500" : "bg-green-50 text-green-600 animate-pulse"}`}
                            >
                              {log.punch_out ? "Completed" : "Active"}
                            </span>
                          </div>

                          <div className="space-y-2 text-xs font-medium text-gray-600">
                            <div className="flex justify-between">
                              <span>Punch In</span>
                              <span className="font-bold text-gray-900">
                                {new Date(log.punch_in).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Punch Out</span>
                              <span className="font-bold text-gray-900">
                                {log.punch_out
                                  ? new Date(log.punch_out).toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" },
                                  )
                                  : "-"}
                              </span>
                            </div>
                            <div className="flex justify-between pt-2 mt-2 border-t border-gray-50">
                              <span className="text-gray-400">Total</span>
                              <span className="font-black text-[#0b645b]">
                                {log.working_hours}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {dailyLogs.length > 3 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                      <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="p-2 text-gray-400 hover:text-[#0b645b] disabled:opacity-30"
                      >
                        <FiChevronLeft />
                        <FiChevronLeft size={16} />
                      </button>
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="p-2 text-gray-400 hover:text-[#0b645b] disabled:opacity-30"
                      >
                        <FiChevronLeft />
                      </button>

                      <span className="px-4 py-2 bg-gray-50 rounded-xl text-xs font-black text-[#0b645b]">
                        {Math.min((currentPage - 1) * 3 + 1, dailyLogs.length)}{" "}
                        - {Math.min(currentPage * 3, dailyLogs.length)}
                      </span>

                      <button
                        onClick={() =>
                          setCurrentPage(
                            Math.min(
                              Math.ceil(dailyLogs.length / 3),
                              currentPage + 1,
                            ),
                          )
                        }
                        disabled={
                          currentPage === Math.ceil(dailyLogs.length / 3)
                        }
                        className="p-2 text-gray-400 hover:text-[#0b645b] disabled:opacity-30"
                      >
                        <FiChevronRight />
                      </button>
                      <button
                        onClick={() =>
                          setCurrentPage(Math.ceil(dailyLogs.length / 3))
                        }
                        disabled={
                          currentPage === Math.ceil(dailyLogs.length / 3)
                        }
                        className="p-2 text-gray-400 hover:text-[#0b645b] disabled:opacity-30"
                      >
                        <FiChevronRight />
                        <FiChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <p className="text-sm text-gray-400 font-bold">
                    No shift logs available yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "Leave" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Balance & Form Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Leave Balance Card */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#0b645b] to-[#084e46] p-8 rounded-3xl text-white shadow-xl shadow-teal-900/20">
                <p className="text-[10px] font-black uppercase tracking-widest text-teal-100 mb-1">
                  Available Balance
                </p>
                <p className="text-5xl font-black mb-2">
                  1.5{" "}
                  <span className="text-2xl font-medium text-teal-200">
                    Days
                  </span>
                </p>
                <p className="text-xs text-teal-100 opacity-80">
                  Remaining for this cycle
                </p>
                {/* Subtle decorative background circle */}
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
              </div>

              {/* Leave Request Form */}
              <div className="col-span-1 lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="font-black text-gray-900 text-lg mb-6">
                  Request New Leave
                </h3>
                <form onSubmit={submitLeave} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="w-full">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                        Start Date
                      </label>
                      <input
                        type="date"
                        min={
                          new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
                            .toISOString()
                            .split("T")[0]
                        }
                        required
                        className="w-full mt-2 p-4 bg-gray-50 rounded-2xl text-sm font-bold border border-gray-100 focus:border-[#0b645b] focus:ring-1 focus:ring-[#0b645b] outline-none transition-all"
                        value={newLeave.date}
                        onChange={(e) =>
                          setNewLeave({ ...newLeave, date: e.target.value })
                        }
                      />
                    </div>
                    <div className="w-full">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                        Leave Type
                      </label>
                      <select
                        value={newLeave.type}
                        onChange={(e) =>
                          setNewLeave({ ...newLeave, type: e.target.value })
                        }
                        className="w-full mt-2 p-4 bg-gray-50 rounded-2xl text-sm font-bold border border-gray-100 focus:border-[#0b645b] focus:ring-1 focus:ring-[#0b645b] outline-none transition-all"
                      >
                        <option value="Sick">Sick Leave</option>
                        <option value="Casual">Casual Leave</option>
                        <option value="Emergency">Emergency Leave</option>
                      </select>
                    </div>
                  </div>
                  <div className="w-full">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                      Reason
                    </label>
                    <input
                      placeholder="Brief description..."
                      required
                      className="w-full mt-2 p-4 bg-gray-50 rounded-2xl text-sm font-bold border border-gray-100 focus:border-[#0b645b] focus:ring-1 focus:ring-[#0b645b] outline-none transition-all"
                      value={newLeave.reason}
                      onChange={(e) =>
                        setNewLeave({ ...newLeave, reason: e.target.value })
                      }
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-4 bg-[#0b645b] text-white rounded-2xl font-black text-sm hover:bg-[#084e46] active:scale-[0.98] transition-all shadow-lg hover:shadow-xl"
                  >
                    Submit Request
                  </button>
                </form>
              </div>
            </div>

            {/* Recent Requests Section */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-black text-gray-900 text-lg mb-6">
                Recent Request History
              </h3>
              {leaveRequests.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                  <p className="text-sm text-gray-400 font-bold">
                    No requests submitted.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {leaveRequests.map((req) => (
                    <div
                      key={req.id || req._id}
                      className="flex justify-between items-center p-5 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-50 p-4 rounded-2xl">
                          <FiFileText className="text-[#0b645b]" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {req.reason}
                          </p>
                          <p className="text-[10px] font-black text-gray-400 uppercase">
                            {req.date}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full ${req.status === "Pending" ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"}`}
                      >
                        {req.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "Salary" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-2xl text-gray-900">Earnings Overview</h3>
                <p className="text-sm text-gray-500 font-medium">Track your performance-based incentives and deductions</p>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-black text-gray-500 uppercase bg-gray-100 px-4 py-1.5 rounded-full tracking-wider">
                Fiscal Year 2026
              </span>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <p className="text-[10px] font-black text-teal-600 uppercase flex items-center gap-2 mb-3">
                  <FiTrendingUp className="text-base" /> Monthly Earnings
                </p>
                <p className="text-4xl font-black text-[#0b645b] group-hover:scale-[1.02] transition-transform">
                  ₹{salary.monthly_income.toLocaleString()}
                </p>
              </div>
              <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <p className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-2 mb-3">
                  <FiDollarSign className="text-base" /> Lifetime Earnings
                </p>
                <p className="text-4xl font-black text-blue-900 group-hover:scale-[1.02] transition-transform">
                  ₹{salary.all_time_income.toLocaleString()}
                </p>
              </div>
              <div className="p-8 bg-red-50/50 rounded-3xl border border-red-100 hover:border-red-200 transition-all">
                <p className="text-[10px] font-black text-red-600 uppercase mb-3">Total Deductions</p>
                <p className="text-4xl font-black text-red-900">
                  ₹{salary.total_deduction.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Deduction Breakdown Section */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <h4 className="font-black text-lg text-gray-900 mb-8">Deduction Breakdown</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                {/* Detailed Breakdown List */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <div>
                      <p className="text-sm font-bold text-gray-900">Early Logout</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase mt-0.5">Applied Penalties</p>
                    </div>
                    <span className="font-black text-gray-900 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                      {salary.early_logout_count} × ₹{salary.early_logout_deduction}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <div>
                      <p className="text-sm font-bold text-gray-900">Approved Leaves</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase mt-0.5">Deduction per day</p>
                    </div>
                    <span className="font-black text-gray-900 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                      {salary.leave_count} × ₹{salary.leave_deduction}
                    </span>
                  </div>
                </div>

                {/* Net Summary Display */}
                <div className="flex flex-col justify-center items-center p-8 bg-gray-900 rounded-3xl text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#0b645b] opacity-10 blur-3xl"></div>
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2 z-10">
                    Net Deduction
                  </span>
                  <span className="text-5xl font-black text-white z-10">
                    ₹{salary.total_deduction.toLocaleString()}
                  </span>
                  <div className="w-16 h-1.5 bg-[#0b645b] mt-6 rounded-full z-10"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
