import { useState, useMemo, useEffect } from "react";
import { 
  FiPlus, FiUser, FiChevronLeft, FiChevronRight, 
  FiChevronsLeft, FiChevronsRight, FiX, FiSearch, 
  FiEdit2, FiTrash2 
} from 'react-icons/fi';
import api from "../services/api";

export default function AdminStaff() {
  const [showForm, setShowForm] = useState(false);
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', designation: '', salary: '', dob: ''
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/admin/staff", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) setStaff(response.data.data);
    } catch (err) { console.error("Error fetching staff", err); }
  };

  const addStaff = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/admin/add-staff", { ...formData, status: 'active' }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        fetchStaff();
        setShowForm(false);
        setFormData({ name: '', email: '', password: '', designation: '', salary: '', dob: '' });
      }
    } catch (err) { console.error("Error adding staff", err); }
  };

  const deleteStaff = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/admin/delete-staff/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStaff();
    } catch (err) { console.error("Error deleting staff", err); }
  };

  const toggleStatus = async (s) => {
    const newStatus = s.status === 'active' ? 'inactive' : 'active';
    try {
      const token = localStorage.getItem("token");
      await api.put(`/admin/update-staff/${s._id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStaff();
    } catch (err) { console.error("Error toggling status", err); }
  };

  const filteredStaff = useMemo(() => {
    return staff.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [staff, searchTerm]);

  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const paginatedStaff = useMemo(() => {
    return filteredStaff.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredStaff, currentPage]);

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Manage Staff</h2>
          <p className="text-gray-500 text-sm">Oversee hospital administrative staff and roles.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-[#0b645b] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#084d46] transition-all"
        >
          {showForm ? <FiX /> : <FiPlus />} {showForm ? "Close" : "Add New Staff"}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(formData).map((key) => (
              <div key={key}>
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">{key}</label>
                <input 
                  type={key === 'password' ? 'password' : key === 'dob' ? 'date' : key === 'salary' ? 'number' : 'text'}
                  value={formData[key]} 
                  className="w-full p-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#0b645b]" 
                  onChange={e => setFormData({ ...formData, [key]: e.target.value })} 
                />
              </div>
            ))}
            <button onClick={addStaff} className="md:col-span-2 bg-[#0b645b] text-white py-3 rounded-xl font-bold hover:bg-[#084d46]">
              Save Staff Profile
            </button>
          </div>
        </div>
      )}

      <div className="relative mb-6">
        <FiSearch className="absolute left-4 top-4 text-gray-400" />
        <input 
          placeholder="Search by name or email..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#0b645b]"
          onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px]">
        {paginatedStaff.map((s) => (
          <div key={s._id} className="p-4 border border-gray-100 rounded-2xl flex justify-between items-center transition-all hover:border-[#0b645b]/20">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-full ${s.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                <FiUser size={24} />
              </div>
              <div>
                <p className="font-black text-gray-900">{s.name}</p>
                <p className="text-[10px] text-gray-400 uppercase font-black">{s.designation}</p>
                <p className="text-xs text-gray-500">{s.email}</p>
                <p className="text-xs font-bold text-[#0b645b]">₹{s.salary || "0"}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="flex gap-2">
                <button className="text-gray-400 hover:text-[#0b645b]"><FiEdit2 size={16}/></button>
                <button onClick={() => deleteStaff(s._id)} className="text-gray-400 hover:text-red-500"><FiTrash2 size={16}/></button>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={s.status === 'active'} onChange={() => toggleStatus(s)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0b645b]"></div>
              </label>
            </div>
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