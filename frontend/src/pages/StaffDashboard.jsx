import { useState } from "react";
import { 
  FiUsers, FiClock, FiCalendar, FiDollarSign, 
  FiLogIn, FiLogOut, FiTrendingUp 
} from "react-icons/fi";

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState("Queue");
  
  const baseSalary = 25000;
  const flatDeduction = 50; 

  const [doctors] = useState([
    { id: 1, name: "Dr. Rajesh Sharma", queue: [{ id: 101, name: "Mukesh Jaswant", status: "Visiting" }] },
    { id: 2, name: "Dr. Anita Verma", queue: [{ id: 201, name: "Leela Jeswal", status: "Visiting" }] }
  ]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(1);
  
  // Attendance State
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [hasPunchedToday, setHasPunchedToday] = useState(false);
  const [punchTime, setPunchTime] = useState(null);
  const [dailyLogs, setDailyLogs] = useState([]); 

  // Leave State
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [newLeave, setNewLeave] = useState({ date: "", reason: "", type: "Full" });
  const [leaveAllowance, setLeaveAllowance] = useState({ full: 1, half: 0.5 });

  const handlePunchIn = () => {
    setPunchTime(new Date());
    setIsPunchedIn(true);
  };

  const handlePunchOut = () => {
    const logoutTime = new Date();
    const durationMs = logoutTime - punchTime;
    const hours = (durationMs / (1000 * 60 * 60)).toFixed(2);
    
    setDailyLogs([...dailyLogs, { 
      login: punchTime.toLocaleTimeString(), 
      logout: logoutTime.toLocaleTimeString(), 
      hours,
      status: hours < 8 ? "Early Logout" : "On Time"
    }]);
    setIsPunchedIn(false);
    setHasPunchedToday(true);
    setPunchTime(null);
  };

  const submitLeave = (e) => {
    e.preventDefault();
    const isFull = newLeave.type === "Full";
    
    // Check allowance
    if ((isFull && leaveAllowance.full > 0) || (!isFull && leaveAllowance.half > 0)) {
      setLeaveRequests([...leaveRequests, { ...newLeave, id: Date.now(), status: "Pending" }]);
      setLeaveAllowance(prev => ({
        full: isFull ? prev.full - 1 : prev.full,
        half: !isFull ? prev.half - 0.5 : prev.half
      }));
      setNewLeave({ date: "", reason: "", type: "Full" });
    } else {
      alert("Leave allowance exhausted for this month.");
    }
  };

  // Logic: Deductions apply only if leave allowance is 0 or status is not On Time
  const attendanceDeductions = dailyLogs.filter(l => l.status !== "On Time").length * flatDeduction;
  const leaveDeductions = (leaveAllowance.full < 0 || leaveAllowance.half < 0) ? flatDeduction : 0;
  const totalDeductions = attendanceDeductions + leaveDeductions;
  
  const finalSalary = baseSalary - totalDeductions;
  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="max-w-5xl mx-auto px-10 py-10">
      <h2 className="text-2xl font-black text-gray-900 mb-8">Staff Dashboard</h2>

      <div className="flex gap-4 mb-8">
        {[
          { name: "Queue", icon: <FiUsers /> },
          { name: "Attendance", icon: <FiClock /> },
          { name: "Leave", icon: <FiCalendar /> },
          { name: "Salary", icon: <FiDollarSign /> }
        ].map((tab) => (
          <button key={tab.name} onClick={() => setActiveTab(tab.name)} className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition ${activeTab === tab.name ? "bg-[#0b645b] text-white shadow-lg" : "bg-white text-gray-400"}`}>
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm min-h-[400px]">
        {activeTab === "Queue" && (
          <div>
            <select className="w-full p-4 mb-6 rounded-2xl border border-gray-200 font-bold text-sm" onChange={(e) => setSelectedDoctorId(Number(e.target.value))}>
              {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            {selectedDoctor?.queue.map(p => (
              <div key={p.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between">
                <p className="font-bold">{p.name}</p>
                <span className="text-[10px] font-black uppercase bg-green-100 text-green-700 px-3 py-1 rounded-full">{p.status}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Attendance" && (
          <div className="space-y-8">
            <div className="flex justify-center gap-6">
              <button onClick={handlePunchIn} disabled={isPunchedIn || hasPunchedToday} className="px-10 py-5 rounded-3xl font-black bg-green-600 text-white disabled:bg-gray-300">Punch In</button>
              <button onClick={handlePunchOut} disabled={!isPunchedIn} className="px-10 py-5 rounded-3xl font-black bg-red-600 text-white disabled:bg-gray-300">Punch Out</button>
            </div>
            <div className="space-y-3">
              {dailyLogs.map((log, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-2xl flex justify-between text-sm font-bold">
                  <span>In: {log.login} | Out: {log.logout}</span>
                  <span>Worked: {log.hours} hrs</span>
                  <span className={log.status === "On Time" ? "text-green-600" : "text-red-600"}>{log.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Leave" && (
          <div className="space-y-6">
            <div className="text-xs font-bold text-gray-500">Available: {leaveAllowance.full} Full-day, {leaveAllowance.half} Half-day</div>
            <form onSubmit={submitLeave} className="flex gap-4 p-6 bg-gray-50 rounded-2xl">
              <input type="date" min={minDate} required className="p-3 rounded-xl border" value={newLeave.date} onChange={(e) => setNewLeave({...newLeave, date: e.target.value})} />
              <select className="p-3 rounded-xl border" value={newLeave.type} onChange={(e) => setNewLeave({...newLeave, type: e.target.value})}>
                <option value="Full">Full Day</option>
                <option value="Half">Half Day</option>
              </select>
              <input required placeholder="Reason" className="flex-1 p-3 rounded-xl border" value={newLeave.reason} onChange={(e) => setNewLeave({...newLeave, reason: e.target.value})} />
              <button type="submit" className="px-6 bg-[#0b645b] text-white rounded-xl font-bold">Submit</button>
            </form>
            <div className="space-y-3">
              {leaveRequests.map(req => (
                <div key={req.id} className="p-4 border rounded-2xl flex justify-between text-sm font-bold">
                  <span>{req.date} ({req.type}): {req.reason}</span>
                  <span className="text-amber-600">{req.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Salary" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-green-50 rounded-3xl"><p className="text-[10px] font-black text-green-600 uppercase">Base Salary</p><p className="text-4xl font-black text-[#0b645b]">₹{baseSalary}</p></div>
              <div className="p-6 bg-red-50 rounded-3xl"><p className="text-[10px] font-black text-red-600 uppercase">Total Deductions</p><p className="text-3xl font-black text-red-900">₹{totalDeductions}</p></div>
            </div>
            <div className="p-6 bg-blue-50 rounded-3xl"><p className="text-[10px] font-black text-blue-600 uppercase">Net Salary</p><p className="text-4xl font-black text-blue-900">₹{finalSalary}</p></div>
          </div>
        )}
      </div>
    </div>
  );
}