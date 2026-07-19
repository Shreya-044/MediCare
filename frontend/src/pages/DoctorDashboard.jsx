import { useState } from "react";
import {
  FiUsers,
  FiClock,
  FiCalendar,
  FiDollarSign,
  FiCheck,
  FiX,
  FiUser,
  FiLogIn,
  FiLogOut,
  FiFileText,
  FiTrendingUp,
} from "react-icons/fi";

export default function DoctorHome() {
  const [activeTab, setActiveTab] = useState("Queue");
  const [queue, setQueue] = useState([
    { id: 1, name: "Mukesh Jaswant", time: "Now", status: "Visiting" },
    { id: 2, name: "Leela Jeswal", time: "10:30 AM", status: "Next" },
    { id: 3, name: "Rajesh Kumar", time: "11:00 AM", status: "Pending" },
  ]);
  const [donePatients, setDonePatients] = useState([]);
  const [noShowPatients, setNoShowPatients] = useState([]);
  const [isDoctorLive, setIsDoctorLive] = useState(false);
  const consultationFee = 500;
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [newLeave, setNewLeave] = useState({ date: "", reason: "", type: "Sick" });

  const handlePatientVisit = (id, action) => {
    // Prevent interaction if doctor is not live
    if (!isDoctorLive) return;

    const patient = queue.find((p) => p.id === id);
    if (action === "visited") {
      setDonePatients([...donePatients, { ...patient, status: "Visited" }]);
    } else if (action === "noshow") {
      setNoShowPatients([...noShowPatients, { ...patient, status: "No Show" }]);
    }

    const remaining = queue.filter((p) => p.id !== id);
    if (remaining.length > 0) {
      remaining[0].status = "Visiting";
      if (remaining.length > 1) remaining[1].status = "Next";
    }
    setQueue(remaining);
  };

  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState(null);
  const [dailyLogs, setDailyLogs] = useState([]);

  const tabs = [
    { name: "Queue", icon: <FiUsers /> },
    { name: "Attendance", icon: <FiClock /> },
    { name: "Leave", icon: <FiCalendar /> },
    { name: "Salary", icon: <FiDollarSign /> },
  ];

  const hasPunchedToday = dailyLogs.some(
    (log) => log.date === new Date().toLocaleDateString()
  );

  const handlePunchIn = () => {
    setPunchInTime(new Date());
    setIsPunchedIn(true);
    setIsDoctorLive(true);
  };

  const handlePunchOut = () => {
    const punchOutTime = new Date();
    const durationInMs = punchOutTime - punchInTime;
    const hours = Math.max(0, durationInMs / (1000 * 60 * 60));
    const status = hours < 8 ? "Early Logout" : "On Time";

    setDailyLogs([
      ...dailyLogs,
      { date: new Date().toLocaleDateString(), duration: hours, status },
    ]);
    setIsPunchedIn(false);
    setIsDoctorLive(false);
  };

  const submitLeave = (e) => {
    e.preventDefault();
    setLeaveRequests([...leaveRequests, { ...newLeave, id: Date.now(), status: "Pending" }]);
    setNewLeave({ date: "", reason: "", type: "Sick" });
  };

  // Salary Calculations
  const totalEarningsThisMonth = donePatients.length * consultationFee;
  const totalDeductions = dailyLogs.filter(l => l.status === "Early Logout").length * 200;
  const earningsTillDate = totalEarningsThisMonth - totalDeductions;

  return (
    <div className="max-w-5xl mx-auto px-10 py-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-gray-900">Doctor Dashboard</h2>
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 ${isDoctorLive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          <div className={`w-2 h-2 rounded-full ${isDoctorLive ? "bg-green-500" : "bg-red-500"}`}></div>
          {isDoctorLive ? "Doctor Available" : "Doctor Unavailable"}
        </div>
      </div>
      
      <div className="flex gap-4 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition ${
              activeTab === tab.name
                ? "bg-[#0b645b] text-white shadow-lg shadow-[#0b645b]/20"
                : "bg-white text-gray-400 hover:bg-gray-50"
            }`}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm min-h-[400px]">
        {activeTab === "Queue" && (
          <div className="space-y-8">
            {/* Visiting Container - Disabled if not live */}
            {queue.length > 0 && queue[0].status === "Visiting" && (
              <div className={`p-6 rounded-3xl text-white shadow-xl transition-all ${isDoctorLive ? "bg-[#0b645b] shadow-[#0b645b]/20" : "bg-gray-400 opacity-70"}`}>
                <p className="text-[10px] font-black uppercase opacity-70 mb-2">
                  {isDoctorLive ? "Currently Visiting" : "Doctor Unavailable - Queue Paused"}
                </p>
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black">{queue[0].name}</h3>
                  <div className="flex gap-3">
                    <button 
                      disabled={!isDoctorLive}
                      onClick={() => handlePatientVisit(queue[0].id, "visited")} 
                      className={`p-3 rounded-2xl transition ${isDoctorLive ? "bg-white/20 hover:bg-white/30" : "bg-gray-300 cursor-not-allowed"}`}
                    >
                      <FiCheck size={20}/>
                    </button>
                    <button 
                      disabled={!isDoctorLive}
                      onClick={() => handlePatientVisit(queue[0].id, "noshow")} 
                      className={`p-3 rounded-2xl transition ${isDoctorLive ? "bg-white/20 hover:bg-white/30" : "bg-gray-300 cursor-not-allowed"}`}
                    >
                      <FiX size={20}/>
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* ... Rest of Queue Tab remains unchanged ... */}
            <div>
              <h3 className="font-black text-gray-900 mb-4 px-1">Upcoming Patients</h3>
              <div className="space-y-3">
                {queue.slice(1).map((p) => (
                  <div key={p.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="bg-white p-3 rounded-xl border border-gray-100"><FiUser className="text-[#0b645b]" /></div>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-gray-900">{p.name}</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase">{p.status} • {p.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-8 border-t border-gray-100 space-y-6">
              <div>
                <h3 className="font-black text-gray-400 uppercase text-[10px] tracking-widest mb-4 px-1">Completed</h3>
                <div className="space-y-2">
                  {donePatients.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                      <p className="font-bold text-sm text-blue-900">{p.name}</p>
                      <span className="text-[10px] font-black uppercase bg-blue-100 text-blue-600 px-3 py-1 rounded-full">Done</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-black text-gray-400 uppercase text-[10px] tracking-widest mb-4 px-1">Did Not Show Up</h3>
                <div className="space-y-2">
                  {noShowPatients.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-2xl">
                      <p className="font-bold text-sm text-red-900">{p.name}</p>
                      <span className="text-[10px] font-black uppercase bg-red-100 text-red-600 px-3 py-1 rounded-full">No Show</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ... Rest of Tabs (Attendance, Leave, Salary) remain as before ... */}
        {activeTab === "Attendance" && (
          <div className="flex flex-col items-center gap-8 py-4">
            <h3 className="font-black text-gray-900 text-xl">Shift Tracking</h3>
            <div className="flex gap-6">
              <button onClick={handlePunchIn} disabled={isPunchedIn || hasPunchedToday} className={`flex items-center gap-3 px-10 py-5 rounded-3xl font-black text-lg transition-all shadow-lg ${isPunchedIn || hasPunchedToday ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700 hover:scale-105"}`}><FiLogIn /> Punch In</button>
              <button onClick={handlePunchOut} disabled={!isPunchedIn} className={`flex items-center gap-3 px-10 py-5 rounded-3xl font-black text-lg transition-all shadow-lg ${!isPunchedIn ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700 hover:scale-105"}`}><FiLogOut /> Punch Out</button>
            </div>
            <div className="w-full mt-6 bg-gray-50 p-6 rounded-3xl border border-gray-100">
              <h4 className="font-black text-sm text-gray-900 mb-6">Recent Shift Logs</h4>
              <div className="space-y-3">
                {dailyLogs.length === 0 ? <p className="text-xs text-gray-400 font-bold text-center py-4">No attendance records yet.</p> : dailyLogs.map((log, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-gray-100">
                    <span className="text-sm font-black text-gray-900">{log.date}</span>
                    <span className="text-sm font-bold text-gray-600">{log.duration.toFixed(2)} hrs</span>
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${log.status === "On Time" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>{log.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Leave" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                <p className="text-[10px] font-black text-indigo-600 uppercase">Available Leave</p>
                <p className="text-3xl font-black text-indigo-900">12 Days</p>
              </div>
              <div className="col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="font-black text-gray-900 mb-4">Request New Leave</h3>
                <form onSubmit={submitLeave} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Date</label>
                    <input type="date" min={new Date().toISOString().split("T")[0]} required className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold border outline-none" value={newLeave.date} onChange={(e) => setNewLeave({...newLeave, date: e.target.value})} />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Reason</label>
                    <input placeholder="Personal, Health, etc." required className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold border outline-none" value={newLeave.reason} onChange={(e) => setNewLeave({...newLeave, reason: e.target.value})} />
                  </div>
                  <button type="submit" className="px-6 py-3 bg-[#0b645b] text-white rounded-xl font-bold hover:bg-[#084e46]">Submit</button>
                </form>
              </div>
            </div>
            <div>
              <h3 className="font-black text-gray-900 mb-4">Recent Requests</h3>
              {leaveRequests.length === 0 ? <p className="text-xs text-gray-400 font-bold text-center py-10">No requests submitted.</p> : leaveRequests.map((req) => (
                <div key={req.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-3">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-3 rounded-xl border"><FiFileText className="text-gray-400"/></div>
                    <div>
                      <p className="text-sm font-bold">{req.reason}</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase">{req.date}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${req.status === "Pending" ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600"}`}>{req.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Salary" && (
          <div className="space-y-6">
            <h3 className="font-black text-gray-900">Salary & Earnings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-green-50 rounded-3xl border border-green-100">
                <p className="text-[10px] font-black text-green-600 uppercase flex items-center gap-2"><FiTrendingUp/> Earning This Month</p>
                <p className="text-4xl font-black text-[#0b645b] mt-2">₹{totalEarningsThisMonth}</p>
              </div>
              <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                <p className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-2"><FiDollarSign/> Earnings Till Date</p>
                <p className="text-4xl font-black text-blue-900 mt-2">₹{earningsTillDate}</p>
              </div>
            </div>
            <div className="p-6 bg-red-50 rounded-3xl border border-red-100">
              <p className="text-[10px] font-black text-red-600 uppercase">Deductions (Leaves/Early)</p>
              <p className="text-3xl font-black text-red-900 mt-2">₹{totalDeductions}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}