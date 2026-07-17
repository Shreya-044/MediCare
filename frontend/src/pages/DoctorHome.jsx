import { useState } from "react";
import { FiUsers, FiClock, FiCalendar, FiDollarSign } from "react-icons/fi";

export default function DoctorHome() {
  const [activeTab, setActiveTab] = useState("Queue");
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState(null);
  const [dailyLogs, setDailyLogs] = useState([]);

  const hourlyRate = 50;

  const tabs = [
    { name: "Queue", icon: <FiUsers /> },
    { name: "Attendance", icon: <FiClock /> },
    { name: "Leave", icon: <FiCalendar /> },
    { name: "Salary", icon: <FiDollarSign /> },
  ];

  const handlePunchIn = () => {
    setPunchInTime(new Date());
    setIsPunchedIn(true);
  };

  const handlePunchOut = () => {
    const punchOutTime = new Date();
    const durationInMs = punchOutTime - punchInTime;
    const hours = Math.max(0, durationInMs / (1000 * 60 * 60));
    const status = hours < 8 ? "Early Logout" : "On Time";
    
    setDailyLogs([...dailyLogs, { date: new Date().toLocaleDateString(), duration: hours, status }]);
    setIsPunchedIn(false);
  };

  const totalMonthlyHours = dailyLogs.reduce((acc, log) => acc + log.duration, 0);

  return (
    <div className="max-w-5xl mx-auto px-10 py-10">
      <h2 className="text-2xl font-black text-gray-900 mb-8">Doctor Dashboard</h2>
      {/* Tabs Navigation */}
      <div className="flex gap-4 mb-8">
        {tabs.map((tab) => (
          <button key={tab.name} onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition ${
              activeTab === tab.name ? "bg-[#0b645b] text-white" : "bg-white text-gray-400 hover:bg-gray-50"
            }`}>
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm min-h-[400px]">
        
        {activeTab === "Attendance" && (
          <div className="flex flex-col items-center gap-6">
            <h3 className="font-black text-gray-900">Shift Tracking</h3>
            <div className="flex gap-4">
              <button onClick={handlePunchIn} disabled={isPunchedIn} className={`px-8 py-4 rounded-2xl font-bold ${isPunchedIn ? 'bg-gray-300' : 'bg-green-600 text-white'}`}>Punch In</button>
              <button onClick={handlePunchOut} disabled={!isPunchedIn} className={`px-8 py-4 rounded-2xl font-bold ${!isPunchedIn ? 'bg-gray-300' : 'bg-red-600 text-white'}`}>Punch Out</button>
            </div>
            
            <div className="w-full mt-6">
              <h4 className="font-black text-sm mb-4">Recent Logs</h4>
              {dailyLogs.map((log, idx) => (
                <div key={idx} className="flex justify-between p-3 border-b text-xs font-bold">
                  <span>{log.date}</span>
                  <span>{log.duration.toFixed(2)} hrs</span>
                  <span className={log.status === "On Time" ? "text-green-600" : "text-red-500"}>{log.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Salary" && (
          <div>
            <h3 className="font-black text-gray-900 mb-4">Monthly Salary Summary</h3>
            <div className="p-6 bg-teal-50 rounded-2xl border border-teal-100 mb-6">
              <p className="text-[10px] font-black text-teal-600 uppercase">Estimated Monthly Total</p>
              <p className="text-3xl font-black text-[#0b645b]">${(totalMonthlyHours * hourlyRate).toFixed(2)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase">Breakdown</p>
              <div className="flex justify-between text-sm font-bold">
                <span>Total Billable Hours:</span>
                <span>{totalMonthlyHours.toFixed(2)} hrs</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span>Deductions (Leaves/Early):</span>
                <span>${((8 * dailyLogs.length - totalMonthlyHours) * hourlyRate).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}