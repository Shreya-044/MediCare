import { useState, useEffect } from "react";
import api from "../services/api";
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
  const [queue, setQueue] = useState([]);
  useEffect(() => {
    fetchQueue();
    fetchAttendance();
    fetchLeaves();
    fetchSalary();
  }, []);
  const fetchQueue = async () => {
    try {
      const response = await api.get("/queue");

      if (response.data.success) {
        const formattedQueue = response.data.data.map((item, index) => ({
          _id: item._id,
          name: item.patient_name,
          time: item.appointment_time,
          status:
            index === 0
              ? "Visiting"
              : index === 1
                ? "Next"
                : "Pending",
        }));

        setQueue(formattedQueue);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const [donePatients, setDonePatients] = useState([]);
  const [noShowPatients, setNoShowPatients] = useState([]);
  const [isDoctorLive, setIsDoctorLive] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [newLeave, setNewLeave] = useState({ date: "", reason: "", type: "Sick" });

  const handlePatientVisit = (id, action) => {
    // Prevent interaction if doctor is not live
    if (!isDoctorLive) return;

    const patient = queue.find((p) => p._id === id);
    if (action === "visited") {
      setDonePatients([...donePatients, { ...patient, status: "Visited" }]);
    } else if (action === "noshow") {
      setNoShowPatients([...noShowPatients, { ...patient, status: "No Show" }]);
    }

    const remaining = queue.filter((p) => p._id !== id);
    if (remaining.length > 0) {
      remaining[0].status = "Visiting";
      if (remaining.length > 1) remaining[1].status = "Next";
    }
    setQueue(remaining);
  };

  const fetchAttendance = async () => {

    try {

      const response = await api.get("/doctor/attendance");

      if (response.data.success) {

        setDailyLogs(response.data.data);

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

  }
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState(null);
  const [dailyLogs, setDailyLogs] = useState([]);

  const [salary, setSalary] = useState({
    monthly_income: 0,
    all_time_income: 0,
    total_deduction: 0,
    early_logout_count: 0,
    leave_count: 0,
    early_logout_deduction: 0,
    leave_deduction: 0,
  });

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

  const tabs = [
    { name: "Queue", icon: <FiUsers /> },
    { name: "Attendance", icon: <FiClock /> },
    { name: "Leave", icon: <FiCalendar /> },
    { name: "Salary", icon: <FiDollarSign /> },
  ];

  const hasPunchedToday = dailyLogs.some(
    (log) => log.date === new Date().toLocaleDateString()
  );

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

      const response = await api.post(

        "/leave",

        newLeave

      );

      if (response.data.success) {

        alert(response.data.message);

        setNewLeave({

          date: "",

          reason: "",

          type: "Sick"

        });

        fetchLeaves();

      }

    }

    catch (err) {

      alert(err.response?.data?.message);

    }

  }

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
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition ${activeTab === tab.name
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
          <div className="space-y-2">
            {donePatients.map((p) => (
              <div
                key={p._id}
                className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-2xl"
              >
                <p className="font-bold text-sm text-blue-900">
                  {p.name}
                </p>

                <span className="text-[10px] font-black uppercase bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                  Done
                </span>
              </div>
            ))}
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
                {dailyLogs.map((log, idx) => (

                  <div
                    key={idx}
                    className="p-4 bg-white rounded-2xl border border-gray-100"
                  >

                    <p>Date : {log.date}</p>

                    <p>Punch In : {new Date(log.punch_in).toLocaleTimeString()}</p>

                    <p>
                      Punch Out :
                      {log.punch_out
                        ? new Date(log.punch_out).toLocaleTimeString()
                        : "Still Working"}
                    </p>

                    <p>Working Hours : {log.working_hours}</p>

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

                  {/* Date */}
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">
                      Date
                    </label>

                    <input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      required
                      className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold border outline-none"
                      value={newLeave.date}
                      onChange={(e) =>
                        setNewLeave({
                          ...newLeave,
                          date: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Reason */}
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">
                      Reason
                    </label>

                    <input
                      placeholder="Personal, Health, etc."
                      required
                      className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold border outline-none"
                      value={newLeave.reason}
                      onChange={(e) =>
                        setNewLeave({
                          ...newLeave,
                          reason: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* ADD THIS HERE */}
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">
                      Leave Type
                    </label>

                    <select
                      value={newLeave.type}
                      onChange={(e) =>
                        setNewLeave({
                          ...newLeave,
                          type: e.target.value,
                        })
                      }
                      className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold border outline-none"
                    >
                      <option value="Sick">Sick</option>
                      <option value="Casual">Casual</option>
                      <option value="Emergency">Emergency</option>
                    </select>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#0b645b] text-white rounded-xl font-bold hover:bg-[#084e46]"
                  >
                    Submit
                  </button>

                </form>
              </div>
            </div>
            <div>
              <h3 className="font-black text-gray-900 mb-4">Recent Requests</h3>
              {leaveRequests.length === 0 ? <p className="text-xs text-gray-400 font-bold text-center py-10">No requests submitted.</p> : leaveRequests.map((req) => (
                <div key={req.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-3">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-3 rounded-xl border"><FiFileText className="text-gray-400" /></div>
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
                <p className="text-[10px] font-black text-green-600 uppercase flex items-center gap-2"><FiTrendingUp /> Earning This Month</p>
                <p className="text-4xl font-black text-[#0b645b] mt-2">₹{salary.monthly_income}</p>
              </div>
              <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                <p className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-2"><FiDollarSign /> Earnings Till Date</p>
                <p className="text-4xl font-black text-blue-900 mt-2">₹{salary.all_time_income}</p>
              </div>
            </div>
            <div className="p-6 bg-red-50 rounded-3xl border border-red-100">
              <p className="text-[10px] font-black text-red-600 uppercase">Deductions (Leaves/Early)</p>
              <p className="text-3xl font-black text-red-900 mt-2">₹{salary.total_deduction}</p>
            </div>
            <div className="bg-white border rounded-3xl p-6">

              <h4 className="font-black mb-4">
                Deduction Details
              </h4>

              <div className="space-y-3">

                <div className="flex justify-between">
                  <span>Early Logout</span>
                  <span>
                    {salary.early_logout_count} × ₹
                    {salary.early_logout_deduction}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Approved Leaves</span>
                  <span>
                    {salary.leave_count} × ₹
                    {salary.leave_deduction}
                  </span>
                </div>

                <hr />

                <div className="flex justify-between font-bold">
                  <span>Total Deduction</span>
                  <span>₹{salary.total_deduction}</span>
                </div>

              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}