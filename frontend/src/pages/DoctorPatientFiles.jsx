import { useState, useEffect } from "react";
import { FiCalendar, FiFileText, FiUser, FiAlertCircle, FiSearch } from "react-icons/fi";
import api from "../services/api";

export default function DoctorPatientFiles() {
  const [patientFiles, setPatientFiles] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPatientFiles(selectedDate);
  }, [selectedDate]);

  const fetchPatientFiles = async (date) => {
    setLoading(true);
    try {
      const response = await api.get(`/doctor/patient-files?date=${date}`);
      if (response.data.success) {
        setPatientFiles(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch patient files:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFiles = patientFiles.filter(file => 
    file.patient_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto p-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Patient Files</h2>
          <p className="text-sm text-gray-500 font-medium">Review clinical documents and diagnostic records.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3.5 text-gray-400" size={16} />
            <input 
              placeholder="Search patient..."
              className="pl-10 pr-4 py-3 bg-white rounded-xl text-sm font-bold border border-gray-100 shadow-sm outline-none focus:border-[#0b645b]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
            <FiCalendar className="text-[#0b645b] ml-2" />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-sm font-bold bg-transparent outline-none p-2"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-center py-10 text-gray-400 font-bold">Loading records...</p>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-3xl">
            <FiAlertCircle className="mx-auto text-gray-300 mb-3" size={32} />
            <p className="text-gray-400 font-bold">No patient files found for this date.</p>
          </div>
        ) : (
          filteredFiles.map((file) => (
            <div key={file._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
              <div className="flex items-center gap-6">
                <div className="bg-blue-50 p-4 rounded-full text-blue-600">
                  <FiUser size={24} />
                </div>
                <div>
                  <p className="text-lg font-black text-gray-900">{file.patient_name}</p>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">ID: {file.patient_id}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{file.file_title}</p>
                  <p className="text-[10px] uppercase font-bold text-gray-400">{file.file_type}</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0b645b] text-white rounded-xl text-xs font-bold hover:bg-[#084e46] transition">
                  <FiFileText /> View Report
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}