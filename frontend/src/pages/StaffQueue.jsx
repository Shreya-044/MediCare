import { useState } from "react";
import { FiUsers, FiCheckCircle, FiXCircle, FiClock, FiUser } from "react-icons/fi";

export default function StaffQueue() {
  const [doctors] = useState([
    { 
      id: 1, 
      name: "Dr. Rajesh Sharma", 
      queue: [
        { id: 101, token: "A01", name: "Mukesh Jaswant", status: "Visiting", category: "General Checkup" },
        { id: 102, token: "A02", name: "Sunita Rao", status: "Waiting", category: "Follow-up" },
        { id: 103, token: "A00", name: "Amit Kumar", status: "Completed", category: "Consultation" },
        { id: 104, token: "A99", name: "Priya Singh", status: "No-Show", category: "General Checkup" }
      ] 
    },
    { 
      id: 2, 
      name: "Dr. Anita Verma", 
      queue: [
        { id: 201, token: "B01", name: "Leela Jeswal", status: "Visiting", category: "Consultation" },
        { id: 202, token: "B02", name: "Vikram Seth", status: "Completed", category: "Follow-up" }
      ] 
    }
  ]);
  
  const [selectedDoctorId, setSelectedDoctorId] = useState(1);
  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId);

  // Helper filters
  const activeQueue = selectedDoctor?.queue.filter(p => p.status === "Visiting" || p.status === "Waiting") || [];
  const completedPatients = selectedDoctor?.queue.filter(p => p.status === "Completed") || [];
  const noShowPatients = selectedDoctor?.queue.filter(p => p.status === "No-Show") || [];

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-10 py-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#0b645b]/10 p-3 rounded-2xl text-[#0b645b]"><FiUsers size={24} /></div>
          <div>
            <h2 className="text-2xl font-black text-gray-900">Patient Queue</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{selectedDoctor?.name}</p>
          </div>
        </div>
        <select 
          className="bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm font-bold text-sm outline-none cursor-pointer hover:border-gray-200 transition" 
          onChange={(e) => setSelectedDoctorId(Number(e.target.value))}
        >
          {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      {/* Main Active Queue */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm mb-8">
        <h3 className="text-sm font-black text-gray-900 uppercase mb-6 flex items-center gap-2">
          <FiClock className="text-[#0b645b]" /> Active Queue ({activeQueue.length})
        </h3>
        
        <div className="space-y-4">
          {activeQueue.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl">
              <p className="text-gray-400 font-bold text-sm">No patients currently in queue.</p>
            </div>
          ) : (
            activeQueue.map((p, index) => (
              <div key={p.id} className={`p-5 rounded-2xl border flex justify-between items-center transition-all ${index === 0 ? "bg-white border-[#0b645b]/20 shadow-md" : "bg-gray-50 border-gray-100"}`}>
                <div className="flex items-center gap-4">
                  <div className={`font-black text-xs px-3 py-1 rounded-lg ${index === 0 ? "bg-[#0b645b] text-white" : "bg-white text-gray-500 border border-gray-200"}`}>
                    {p.token}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{p.name}</p>
                    <p className="text-[10px] font-bold text-gray-400">{p.category}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full ${p.status === "Visiting" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                  {p.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Split View for Completed & No-Show */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Completed */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-black text-gray-900 uppercase mb-6 flex items-center gap-2">
            <FiCheckCircle className="text-green-600" /> Completed ({completedPatients.length})
          </h3>
          <div className="space-y-3">
            {completedPatients.map(p => (
              <div key={p.id} className="p-4 bg-green-50/50 rounded-2xl border border-green-100 flex justify-between items-center">
                <p className="font-bold text-gray-700 text-xs">{p.name}</p>
                <span className="text-[10px] font-black text-green-700 bg-green-100 px-3 py-1 rounded-lg">Done</span>
              </div>
            ))}
          </div>
        </div>

        {/* No-Show */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-black text-gray-900 uppercase mb-6 flex items-center gap-2">
            <FiXCircle className="text-red-600" /> No-Show ({noShowPatients.length})
          </h3>
          <div className="space-y-3">
            {noShowPatients.map(p => (
              <div key={p.id} className="p-4 bg-red-50/50 rounded-2xl border border-red-100 flex justify-between items-center">
                <p className="font-bold text-gray-700 text-xs">{p.name}</p>
                <span className="text-[10px] font-black text-red-700 bg-red-100 px-3 py-1 rounded-lg">Absent</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}