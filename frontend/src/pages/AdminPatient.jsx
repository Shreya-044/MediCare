import { useState, useEffect, useMemo } from "react";
import { FiUploadCloud, FiUser, FiCalendar } from 'react-icons/fi';
import api from "../services/api";

export default function AdminPatient() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [doctorsList, setDoctorsList] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reportFiles, setReportFiles] = useState({});
  const [loading, setLoading] = useState(false);

  // Load initial doctors list to populate the filter dropdown
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/admin/doctors", {
          headers: { Authorization: `Bearer ${token}` }
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

  // Fetch appointments whenever the target date changes
  useEffect(() => {
    fetchAppointmentsByDate(selectedDate);
  }, [selectedDate]);

  const fetchAppointmentsByDate = async (date) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/admin/patients/appointments?date=${date}`, {
        headers: { Authorization: `Bearer ${token}` }
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

  // Client-side filtering by Doctor ID based on the selection menu
  const filteredAppointments = useMemo(() => {
    if (!selectedDoctorId) return appointments;
    return appointments.filter(appt => appt.doctorId === selectedDoctorId);
  }, [appointments, selectedDoctorId]);

  const handleFileUpload = async (patientId, doctorId) => {
    const file = reportFiles[patientId];
    if (!file) return alert("Please select a file first");

    const formData = new FormData();
    formData.append("report", file);
    formData.append("doctorId", doctorId);

    try {
      const token = localStorage.getItem("token");
      const response = await api.post(`/admin/upload-report/${patientId}`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        }
      });
      
      if (response.data.success) {
        alert("Report uploaded successfully!");
        // Clear file input state for this row locally
        setReportFiles(prev => {
          const updated = { ...prev };
          delete updated[patientId];
          return updated;
        });
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload the report.");
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm animate-in fade-in duration-500">
      
      {/* Header View & Filter Management controls */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Patient Reports</h2>
          <p className="text-gray-500 text-sm">Manage and upload medical records linked to dynamic doctor schedules.</p>
        </div>
        
        {/* Dynamic Filters Hub */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1">Appointment Date</label>
            <input 
              type="date" 
              value={selectedDate}
              className="bg-gray-50 px-4 py-2.5 rounded-xl font-bold border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#0b645b] transition"
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1">Assigned Doctor</label>
            <select
              value={selectedDoctorId}
              className="bg-gray-50 px-4 py-2.5 rounded-xl font-bold border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#0b645b] min-w-[200px] transition"
              onChange={(e) => setSelectedDoctorId(e.target.value)}
            >
              <option value="">All Appointed Doctors</option>
              {doctorsList.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  Dr. {doc.name} ({doc.department})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Appointment Matching Grid */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-20 text-gray-400 font-bold">Loading schedule listings...</div>
        ) : filteredAppointments.map((p) => (
          <div key={p._id} className="p-6 border border-gray-100 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-[#0b645b] transition-all duration-300">
            
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-4 rounded-full text-blue-600 flex-shrink-0">
                <FiUser size={24} />
              </div>
              <div>
                <p className="font-black text-gray-900">{p.name}</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                  <p className="text-xs text-gray-500 font-bold">Appt with: <span className="text-[#0b645b]">Dr. {p.doctorName}</span></p>
                  <span className="text-[10px] text-gray-400 font-bold">•</span>
                  <p className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-bold uppercase tracking-wider">{p.appointmentTime || "Scheduled"}</p>
                </div>
              </div>
            </div>

            {/* Document Processing Actions */}
            <div className="flex flex-wrap items-center gap-3 bg-gray-50/50 p-3 rounded-xl sm:bg-transparent sm:p-0">
              <input 
                type="file" 
                className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 file:cursor-pointer w-full sm:w-auto" 
                onChange={(e) => setReportFiles({...reportFiles, [p._id]: e.target.files[0]})}
              />
              <button 
                onClick={() => handleFileUpload(p._id, p.doctorId)}
                className="bg-[#0b645b] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#084d46] transition-all w-full sm:w-auto"
              >
                <FiUploadCloud size={14} /> Upload Report
              </button>
            </div>

          </div>
        ))}
        
        {!loading && filteredAppointments.length === 0 && (
          <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-gray-400 font-bold">
            No matching patient appointments found for this filter criteria.
          </div>
        )}
      </div>

    </div>
  );
}