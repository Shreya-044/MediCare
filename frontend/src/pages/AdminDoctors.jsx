import { useState, useMemo, useEffect } from "react";
import { 
  FiPlus, FiUser, FiChevronLeft, FiChevronRight, 
  FiChevronsLeft, FiChevronsRight 
} from 'react-icons/fi';
import api from "../services/api";

export default function AdminDoctors() {
  const [showForm, setShowForm] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Removed 'status' from initial state
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', department: '', designation: ''
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/admin/doctors", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) setDoctors(response.data.data);
    } catch (err) { console.error("Error fetching doctors", err); }
  };

  const addDoctor = async () => {
    try {
      const token = localStorage.getItem("token");
      // Explicitly set status to 'active' when sending to backend
      const payload = { ...formData, status: 'active' };
      const response = await api.post("/admin/add-doctor", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        fetchDoctors();
        setShowForm(false);
        setFormData({ name: '', email: '', password: '', phone: '', department: '', designation: '' });
      }
    } catch (err) { console.error("Error adding doctor", err); }
  };

  const toggleStatus = async (doc) => {
    const newStatus = doc.status === 'active' ? 'inactive' : 'active';
    try {
      const token = localStorage.getItem("token");
      await api.put(`/admin/update-doctor/${doc._id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDoctors();
    } catch (err) { console.error("Error toggling status", err); }
  };

  const totalPages = Math.ceil(doctors.length / itemsPerPage);
  const paginatedDoctors = useMemo(() => {
    return doctors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [doctors, currentPage]);

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Manage Doctors</h2>
          <p className="text-gray-500 text-sm">Add and manage medical staff credentials.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-[#0b645b] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#084d46] transition-all"
        >
          <FiPlus /> {showForm ? "Close" : "Add New Doctor"}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(formData).map((key) => (
              <div key={key}>
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">{key}</label>
                <input 
                  type={key === 'password' ? 'password' : 'text'}
                  value={formData[key]} 
                  className="w-full p-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#0b645b]" 
                  onChange={e => setFormData({ ...formData, [key]: e.target.value })} 
                />
              </div>
            ))}
            <button onClick={addDoctor} className="md:col-span-2 bg-[#0b645b] text-white py-3 rounded-xl font-bold hover:bg-[#084d46]">
              Save Doctor Profile
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 min-h-[300px]">
        {paginatedDoctors.map((doc) => (
          <div key={doc._id} className="p-6 border border-gray-100 rounded-2xl hover:shadow-md transition flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-full ${doc.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                <FiUser size={24} />
              </div>
              <div>
                <p className="font-black text-gray-900">{doc.name}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">{doc.designation} • {doc.department}</p>
                <p className="text-[10px] font-bold text-gray-400 mt-1">{doc.phone}</p>
              </div>
            </div>
            <button 
              onClick={() => toggleStatus(doc)} 
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition ${doc.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            >
              {doc.status}
            </button>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-8 border-t border-gray-100 mt-8">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(1)} className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-20"><FiChevronsLeft /></button>
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-20"><FiChevronLeft /></button>
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest w-20 text-center">{currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-20"><FiChevronRight /></button>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)} className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-20"><FiChevronsRight /></button>
        </div>
      )}
    </div>
  );
}