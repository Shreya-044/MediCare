import { useState } from "react";
import {
  FiClock,
  FiCalendar,
  FiDollarSign,
  FiActivity,
  FiUser,
  FiBell,
  FiChevronRight,
  FiCheckCircle,
  FiAlertTriangle,
  FiPlus,
  FiMinus,
} from "react-icons/fi";

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState("Latest");
  const baseSalary = 25000;
  const flatDeduction = 50;

  // UI State
  const [showLeaveForm, setShowLeaveForm] = useState(false);

  // Attendance State
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [hasPunchedToday, setHasPunchedToday] = useState(false);
  const [punchTime, setPunchTime] = useState(null);
  const [dailyLogs, setDailyLogs] = useState([]);

  // Leave State
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [newLeave, setNewLeave] = useState({
    date: "",
    reason: "",
    type: "Full",
  });
  const [leaveAllowance, setLeaveAllowance] = useState({ full: 1, half: 0.5 });

  const handlePunchIn = () => {
    setPunchTime(new Date());
    setIsPunchedIn(true);
  };

  const handlePunchOut = () => {
    const logoutTime = new Date();
    const durationMs = logoutTime - punchTime;
    const hours = (durationMs / (1000 * 60 * 60)).toFixed(2);
    setDailyLogs([
      ...dailyLogs,
      {
        login: punchTime.toLocaleTimeString(),
        logout: logoutTime.toLocaleTimeString(),
        hours,
        status: hours < 8 ? "Early Logout" : "On Time",
      },
    ]);
    setIsPunchedIn(false);
    setHasPunchedToday(true);
    setPunchTime(null);
  };

  const submitLeave = (e) => {
    e.preventDefault();
    const isFull = newLeave.type === "Full";
    if (
      (isFull && leaveAllowance.full > 0) ||
      (!isFull && leaveAllowance.half > 0)
    ) {
      setLeaveRequests([
        ...leaveRequests,
        { ...newLeave, id: Date.now(), status: "Pending" },
      ]);
      setLeaveAllowance((prev) => ({
        full: isFull ? prev.full - 1 : prev.full,
        half: !isFull ? prev.half - 0.5 : prev.half,
      }));
      setNewLeave({ date: "", reason: "", type: "Full" });
      setShowLeaveForm(false);
    } else {
      alert("Leave allowance exhausted.");
    }
  };

  const totalDeductions =
    dailyLogs.filter((l) => l.status !== "On Time").length * flatDeduction +
    (leaveAllowance.full < 0 || leaveAllowance.half < 0 ? flatDeduction : 0);
  const finalSalary = baseSalary - totalDeductions;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-gray-900">Staff Portal</h2>
        <p className="text-gray-500 font-medium">
          Manage your daily operations, attendance, and leave.
        </p>
      </div>

      <div className="flex gap-2 md:gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { name: "Latest", icon: <FiActivity /> },
          { name: "Attendance", icon: <FiClock /> },
          { name: "Leave", icon: <FiCalendar /> },
          { name: "Salary", icon: <FiDollarSign /> },
        ].map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition whitespace-nowrap 
              ${
                activeTab === tab.name
                  ? "bg-[#0b645b] text-white shadow-lg shadow-[#0b645b]/20"
                  : "bg-white text-gray-400 border border-gray-100 hover:text-gray-600"
              }`}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-sm min-h-[500px]">
        {activeTab === "Latest" && (
          <div className="space-y-8 animate-in fade-in duration-500">

            {/* Shift Card + Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-linear-to-r from-[#0b645b] to-[#084e46] p-8 rounded-3xl text-white shadow-xl shadow-[#0b645b]/20 flex flex-col justify-center">
                <p className="text-[10px] uppercase font-black text-teal-200 tracking-widest">
                  Upcoming Shift
                </p>
                <p className="text-3xl font-black mt-2">Morning Shift</p>
                <p className="text-teal-200 text-xs font-bold mt-1">
                  Tomorrow • 08:00 AM - 04:00 PM
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveTab("Attendance")}
                  className="p-6 bg-gray-50 border border-gray-100 rounded-3xl flex flex-col justify-center items-center gap-2 hover:border-[#0b645b] transition group"
                >
                  <FiClock className="text-[#0b645b] group-hover:scale-110 transition" />
                  <span className="font-black text-[10px] uppercase">
                    Attendance
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("Leave")}
                  className="p-6 bg-gray-50 border border-gray-100 rounded-3xl flex flex-col justify-center items-center gap-2 hover:border-[#0b645b] transition group"
                >
                  <FiCalendar className="text-[#0b645b] group-hover:scale-110 transition" />
                  <span className="font-black text-[10px] uppercase">
                    Leave
                  </span>
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Patients Attended",
                  value: "48",
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  title: "Doctors on Leave",
                  value: "1",
                  color: "text-red-600",
                  bg: "bg-red-50",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`p-8 rounded-3xl border border-gray-100 ${stat.bg}`}
                >
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    {stat.title}
                  </p>
                  <p className={`text-5xl font-black ${stat.color} mt-2`}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Notice Board */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <FiBell className="text-[#0b645b]" />
                <h3 className="font-black text-gray-900">
                  Hospital Notice Board
                </h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-gray-200 transition cursor-pointer">
                  <span className="font-bold text-sm text-gray-700">
                    New Sanitation Protocols Effective Monday
                  </span>
                  <FiChevronRight className="text-gray-400" />
                </li>
              </ul>
            </div>

            {/* Daily Task Checklist */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <FiCheckCircle className="text-[#0b645b]" />
                <h3 className="font-black text-gray-900">Shift Duties</h3>
              </div>
              <div className="space-y-4">
                {[
                  { id: 1, label: "Sanitize Workstation" },
                  { id: 2, label: "Check Patient Vitals Chart" },
                  { id: 3, label: "Restock Medicine Cabinet" },
                  { id: 4, label: "Handover Report" }
                ].map((task) => (
                  <label key={task.id} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-[#0b645b] focus:ring-[#0b645b]" />
                    <span className="font-bold text-sm text-gray-600 group-hover:text-gray-900 transition">{task.label}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ATTENDANCE VIEW */}
        {activeTab === "Attendance" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row items-center justify-between bg-gray-50 p-6 rounded-3xl border border-gray-100 gap-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">
                  Today's Status
                </p>
                <p
                  className={`text-xl font-black ${isPunchedIn ? "text-green-600" : "text-gray-600"}`}
                >
                  {isPunchedIn
                    ? "Currently Clocked In"
                    : hasPunchedToday
                      ? "Shift Completed"
                      : "Not yet started"}
                </p>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <button
                  onClick={handlePunchIn}
                  disabled={isPunchedIn || hasPunchedToday}
                  className="flex-1 md:flex-none px-6 py-3 rounded-xl font-black text-sm bg-green-600 text-white disabled:bg-gray-200"
                >
                  Punch In
                </button>
                <button
                  onClick={handlePunchOut}
                  disabled={!isPunchedIn}
                  className="flex-1 md:flex-none px-6 py-3 rounded-xl font-black text-sm bg-red-600 text-white disabled:bg-gray-200"
                >
                  Punch Out
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-black text-gray-900 text-sm mb-4">
                Activity Logs
              </h4>
              {dailyLogs.length === 0 && (
                <p className="text-center text-gray-400 text-xs font-bold py-10">
                  No logs for today.
                </p>
              )}
              {dailyLogs.map((log, i) => (
                <div
                  key={i}
                  className="p-5 bg-white rounded-2xl flex justify-between items-center text-sm font-bold border border-gray-100 shadow-sm"
                >
                  <span className="text-gray-600">
                    In: {log.login} | Out: {log.logout}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] ${log.status === "On Time" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LEAVE VIEW */}
        {activeTab === "Leave" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-6 rounded-3xl border border-green-100">
                <p className="text-[10px] font-black text-green-600 uppercase">
                  Full Days Left
                </p>
                <p className="text-2xl font-black text-green-900">
                  {leaveAllowance.full}
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                <p className="text-[10px] font-black text-blue-600 uppercase">
                  Half Days Left
                </p>
                <p className="text-2xl font-black text-blue-900">
                  {leaveAllowance.half}
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
              <button
                onClick={() => setShowLeaveForm(!showLeaveForm)}
                className="w-full p-6 flex justify-between items-center font-black text-gray-900 hover:bg-gray-50 transition"
              >
                <span className="flex items-center gap-2">
                  {showLeaveForm ? <FiMinus /> : <FiPlus />} Submit New Request
                </span>
              </button>
              {showLeaveForm && (
                <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                  <form
                    onSubmit={submitLeave}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <input
                      type="date"
                      required
                      className="p-4 rounded-xl border border-gray-200 text-sm font-bold"
                      value={newLeave.date}
                      onChange={(e) =>
                        setNewLeave({ ...newLeave, date: e.target.value })
                      }
                    />
                    <select
                      className="p-4 rounded-xl border border-gray-200 text-sm font-bold"
                      value={newLeave.type}
                      onChange={(e) =>
                        setNewLeave({ ...newLeave, type: e.target.value })
                      }
                    >
                      <option value="Full">Full Day</option>
                      <option value="Half">Half Day</option>
                    </select>
                    <input
                      required
                      placeholder="Reason for leave"
                      className="p-4 rounded-xl border border-gray-200 text-sm font-bold col-span-1 md:col-span-2"
                      value={newLeave.reason}
                      onChange={(e) =>
                        setNewLeave({ ...newLeave, reason: e.target.value })
                      }
                    />
                    <button
                      type="submit"
                      className="md:col-span-2 p-4 bg-[#0b645b] text-white rounded-xl font-bold"
                    >
                      Submit Request
                    </button>
                  </form>
                </div>
              )}
            </div>

            <div>
              <h4 className="font-black text-gray-900 text-sm mb-4">
                Request History
              </h4>
              <div className="space-y-3">
                {leaveRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 bg-white border border-gray-100 rounded-2xl flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-black">{req.date}</p>
                      <p className="text-[10px] text-gray-500">
                        {req.type} Day
                      </p>
                    </div>
                    <span className="text-[10px] font-black bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SALARY VIEW */}
        {activeTab === "Salary" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-green-50 rounded-3xl border border-green-100">
                <p className="text-[10px] font-black text-green-600 uppercase">
                  Base Salary
                </p>
                <p className="text-4xl font-black text-[#0b645b] mt-2">
                  ₹{baseSalary}
                </p>
              </div>
              <div className="p-8 bg-red-50 rounded-3xl border border-red-100">
                <p className="text-[10px] font-black text-red-600 uppercase">
                  Total Deductions
                </p>
                <p className="text-3xl font-black text-red-900 mt-2">
                  ₹{totalDeductions}
                </p>
              </div>
            </div>
            <div className="p-8 bg-[#0b645b] rounded-3xl text-white shadow-xl shadow-[#0b645b]/20">
              <p className="text-[10px] font-black text-teal-200 uppercase opacity-80">
                Net Monthly Salary
              </p>
              <p className="text-5xl font-black mt-2">₹{finalSalary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
