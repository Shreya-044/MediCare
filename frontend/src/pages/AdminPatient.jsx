import { useState, useEffect } from "react";
import { FiUser } from "react-icons/fi";
import api from "../services/api";
import ReportModal from "./ReportModal";

export default function AdminPatient() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [doctorsList, setDoctorsList] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/admin/doctors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setDoctorsList(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching doctors filter list", err);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    fetchAppointmentsByDate(selectedDate, selectedDoctorId);
  }, [selectedDate, selectedDoctorId]);

  const fetchAppointmentsByDate = async (date, doctorId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let url = `/admin/patients/appointments?date=${date}`;
      if (doctorId) url += `&doctor_id=${doctorId}`;

      const response = await api.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching patient appointments", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReport = async (patientId, reportData) => {
    try {
      const token = localStorage.getItem("token");
      await api.post(`/admin/save-report/${patientId}`, reportData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Report saved successfully!");
      setShowReportModal(null);
      fetchAppointmentsByDate(selectedDate, selectedDoctorId); // Refresh list
    } catch (err) {
      console.error("Error saving report", err);
    }
  };

  const fetchSavedReport = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/admin/get-report/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) setViewingReport(response.data.data);
    } catch (err) { console.error("No report found", err); }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">Patient Reports</h2>
          <p className="text-gray-500 text-sm mt-1">Manage medical records linked to scheduled appointments.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              className="bg-gray-50 px-4 py-2.5 rounded-xl font-bold border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#0b645b] transition"
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1">Doctor</label>
            <select
              value={selectedDoctorId}
              className="bg-gray-50 px-4 py-2.5 rounded-xl font-bold border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#0b645b] transition"
              onChange={(e) => setSelectedDoctorId(e.target.value)}
            >
              <option value="">All Doctors</option>
              {doctorsList.map((doc) => (
                <option key={doc._id} value={doc._id}>{doc.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-20 text-gray-400 font-bold">Loading schedule...</div>
        ) : appointments.map((p) => (
          <div key={p._id} className="p-4 sm:p-6 border border-gray-100 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-[#0b645b] transition-all">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-full text-blue-600"><FiUser size={20} /></div>
              <div>
                <p className="font-black text-gray-900 text-sm sm:text-base">{p.name}</p>
                <p className="text-[10px] sm:text-xs text-gray-500 font-bold">{p.doctorName} • {p.appointmentTime}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {p.hasReport ? (
                <button onClick={() => fetchSavedReport(p._id)} className="bg-blue-50 text-blue-700 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-blue-100 transition-all w-full sm:w-auto">
                  View Report
                </button>
              ) : (
                <button onClick={() => setShowReportModal(p)} className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-black transition-all w-full sm:w-auto">
                  Create Report
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showReportModal && (
        <ReportModal
          patient={showReportModal}
          onClose={() => setShowReportModal(null)}
          onSave={(data) => handleSaveReport(showReportModal._id, data)}
        />
      )}

      {viewingReport && (
        <ReportModal
          viewData={viewingReport}
          onClose={() => setViewingReport(null)}
        />
      )}

      {!loading && appointments.length === 0 && (
        <div className="text-center py-20 text-gray-400 font-bold bg-gray-50 rounded-2xl">No appointments found.</div>
      )}
    </div>
  );
}