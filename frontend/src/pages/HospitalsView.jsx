import { useState, useMemo } from "react";
import { 
  FiTrash2, FiPlus, FiEdit2, FiSave, FiMapPin, FiPhone, FiMail, 
  FiAlertCircle, FiX, FiSearch, FiChevronLeft, FiChevronRight, 
  FiChevronsLeft, FiChevronsRight
} from 'react-icons/fi';
import api from "../services/api";

export default function HospitalsView({ hospitals = [], fetchHospitals, refreshActivities }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [formData, setFormData] = useState({
    hospital_name: '', email: '', phone: '', emergency_phone: '',
    address: '', city: '', state: '', pincode: ''
  });

  const filteredHospitals = useMemo(() => {
    return hospitals.filter(h => 
      h.hospital_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [hospitals, searchQuery]);

  const totalPages = Math.ceil(filteredHospitals.length / itemsPerPage);
  const paginatedHospitals = filteredHospitals.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );
  const toggleHospitalStatus = async (h) => {
    try {
      const newStatus = h.status === 'active' ? 'inactive' : 'active';
      await api.patch(`/super-admin/hospital/${h._id}/status`, { status: newStatus });
      await fetchHospitals();
      if (refreshActivities) refreshActivities();
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };
  const StatusToggle = ({ status, onToggle }) => (
    <button onClick={onToggle} className={`relative flex items-center h-7 w-16 rounded-full transition-colors duration-300 ${status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}>
      <div className={`absolute top-1 left-1 bg-white h-5 w-5 rounded-full shadow-md transition-transform duration-300 ${status === 'active' ? 'translate-x-9' : 'translate-x-0'}`} />
      <span className={`text-[10px] font-black uppercase text-white ${status === 'active' ? 'ml-2' : 'ml-7'}`}>{status === 'active' ? 'On' : 'Off'}</span>
    </button>
  );

  const saveHospital = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/super-admin/add-hospital", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        fetchHospitals();
        if (refreshActivities) refreshActivities(); 
        setShowForm(false);
        setFormData({ hospital_name: '', email: '', phone: '', emergency_phone: '', address: '', city: '', state: '', pincode: '' });
      }
    } catch (err) { console.log(err); }
  };
  const startEdit = (h) => { setEditingId(h._id); setEditValues(h); };
  const saveEdit = async (id) => {
    try {
      await api.put(`/super-admin/hospital/${id}`, editValues);
      setEditingId(null);
      await fetchHospitals();
      if (refreshActivities) refreshActivities();
    } catch (err) {
      console.error("Failed to save edits:", err);
    }
  };

  const EditField = ({ label, field }) => (
    <div className="mb-2">
      <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider ml-1">{label}</label>
      <input className="w-full border border-gray-200 p-1.5 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#0b645b]" value={editValues[field] || ''} onChange={e => setEditValues({ ...editValues, [field]: e.target.value })} />
    </div>
  );
  const handleAddHospital = async (hospitalData) => {
    try {
      await api.post("/hospital/add", hospitalData);
      await fetchHospitals();
      if (refreshActivities) {
        refreshActivities(); 
      }
    } catch (err) {
      console.error(err);
    }
  };
  const deleteHospital = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hospital?")) return;
    try {
      await api.delete(`/super-admin/hospital/${id}`);
      await fetchHospitals();
      if (refreshActivities) refreshActivities(); // Add this
    } catch (err) {
      console.error("Failed to delete hospital:", err);
    }
  };
  

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Manage Hospitals</h2>
          <p className="text-gray-500 text-sm">Comprehensive view of all hospital facility registrations.</p>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              placeholder="Search..."
              className="pl-9 pr-4 py-3 bg-gray-50 rounded-xl text-sm font-bold outline-none border border-transparent focus:border-[#0b645b] transition w-64"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <button onClick={() => setShowForm(!showForm)} className="bg-[#0b645b] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#084d46] transition-all">
            <FiPlus /> {showForm ? "Close" : "Add New Hospital"}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-3xl animate-in slide-in-from-top-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.keys(formData).map((key) => (
              <div key={key}>
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">{key.replace('_', ' ')}</label>
                <input value={formData[key]} className="w-full p-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#0b645b]" onChange={e => setFormData({ ...formData, [key]: e.target.value })} />
              </div>
            ))}
            <button onClick={saveHospital} className="col-span-2 md:col-span-4 bg-[#0b645b] text-white py-3 rounded-xl font-bold hover:bg-[#084d46]">Save Hospital</button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-gray-400 uppercase text-[10px] tracking-widest font-black">
            <tr><th className="pb-4">Hospital Details</th><th className="pb-4">Location & Logistics</th><th className="pb-4">Status</th><th className="pb-4 text-center">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedHospitals.map(h => (
              <tr key={h._id} className="hover:bg-gray-50/50">
                <td className="py-6">
                  {editingId === h._id ? <div className="w-64"><EditField label="Name" field="hospital_name" /><EditField label="Email" field="email" /><EditField label="Phone" field="phone" /><EditField label="Emergency" field="emergency_phone" /></div> : 
                  <div><p className="font-black text-gray-900">{h.hospital_name}</p><div className="flex items-center gap-2 text-xs text-gray-500 mt-1"><FiMail size={12} />{h.email}</div><div className="flex items-center gap-2 text-xs text-gray-500 mt-1"><FiPhone size={12} />{h.phone}</div></div>}
                </td>
                <td className="py-6 text-xs text-gray-600">
                  {editingId === h._id ? <div className="w-64"><EditField label="Address" field="address" /><EditField label="City" field="city" /><EditField label="State" field="state" /><EditField label="Pincode" field="pincode" /></div> : 
                  <div className="space-y-1"><p className="flex items-center gap-2"><FiMapPin size={12} />{h.address}, {h.city}</p><p className="text-[10px] uppercase font-bold text-gray-400">Pincode: {h.pincode} | State: {h.state}</p><p className="flex items-center gap-2 text-red-500"><FiAlertCircle size={12} /> {h.emergency_phone}</p></div>}
                </td>
                <td className="py-6"><StatusToggle status={h.status} onToggle={() => {}} /></td>
                <td className="py-6 text-center">{editingId === h._id ? <div className="flex gap-2 justify-center"><button onClick={() => saveEdit(h._id)} className="bg-green-600 text-white p-2 rounded-lg"><FiSave size={16} /></button><button onClick={() => setEditingId(null)} className="bg-gray-200 text-gray-600 p-2 rounded-lg"><FiX size={16} /></button></div> : <div className="flex justify-center gap-2"><button onClick={() => startEdit(h)} className="text-blue-500 p-2"><FiEdit2 size={16} /></button><button className="text-red-500 p-2"><FiTrash2 size={16} /></button></div>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-8 border-t border-gray-100">
          {/* First Page */}
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(1)} 
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-20"
          >
            <FiChevronsLeft />
          </button>

          {/* Previous Page */}
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(p => p - 1)} 
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-20"
          >
            <FiChevronLeft />
          </button>
          
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest w-20 text-center">
            {currentPage} of {totalPages}
          </span>
          
          {/* Next Page */}
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(p => p + 1)} 
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-20"
          >
            <FiChevronRight />
          </button>

          {/* Last Page */}
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(totalPages)} 
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-20"
          >
            <FiChevronsRight />
          </button>
        </div>
      )}
    </div>
  );
}