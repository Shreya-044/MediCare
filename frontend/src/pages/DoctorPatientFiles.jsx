import { useState, useEffect } from "react";
import { FiCalendar, FiFileText, FiUser, FiAlertCircle, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import api from "../services/api";

export default function DoctorPatientFiles() {
  const [patientFiles, setPatientFiles] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentViewMonth, setCurrentViewMonth] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Format date as YYYY-MM-DD for the API
    const formattedDate = selectedDate.toISOString().split("T")[0];
    fetchPatientFiles(formattedDate);
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

  const filteredFiles = patientFiles.filter(file => 
    file.patient_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Patient Files</h2>
          <p className="text-sm text-gray-500 font-medium">Review clinical documents and diagnostic records.</p>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:flex-initial">
            <FiSearch className="absolute left-3 top-3.5 text-gray-400" size={16} />
            <input 
              placeholder="Search patient..."
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl text-sm font-bold border border-gray-100 shadow-sm outline-none focus:border-[#0b645b]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
                    const isToday = day.toDateString() === new Date().toDateString();
                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => { setSelectedDate(day); setIsCalendarOpen(false); }}
                        className={`h-9 w-9 rounded-xl flex items-center justify-center text-xs font-bold transition 
                          ${isSelected ? 'bg-[#0b645b] text-white shadow-md' : 'hover:bg-teal-50 text-gray-700'}
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
      </div>

      {/* Files List */}
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
            <div key={file._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-all">
              <div className="flex items-center gap-6">
                <div className="bg-blue-50 p-4 rounded-full text-blue-600">
                  <FiUser size={24} />
                </div>
                <div>
                  <p className="text-lg font-black text-gray-900">{file.patient_name}</p>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">ID: {file.patient_id}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{file.file_title}</p>
                  <p className="text-[10px] uppercase font-bold text-gray-400">{file.file_type}</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0b645b] text-white rounded-xl text-xs font-bold hover:bg-[#084e46] transition">
                  <FiFileText /> View
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}