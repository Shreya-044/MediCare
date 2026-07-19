import { useState, useEffect, useMemo } from "react";
import { 
  FiUser, FiPlus, FiTrash2, FiShield, FiBriefcase, FiAlertCircle, FiSearch, 
  FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight 
} from "react-icons/fi";
import api from "../services/api";

export default function AdminsView({ hospitals = [], refreshActivities }) {
  const [admins, setAdmins] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "", hospital_id: "" });

  useEffect(() => { fetchAdmins(); }, []);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/super-admin/admins", { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) setAdmins(response.data.data);
    } catch (error) { console.error(error); }
  };

  const toggleAdminStatus = async (a) => {
    try {
      const newStatus = a.status === 'active' ? 'inactive' : 'active';
      await api.patch(`/super-admin/admin/${a._id}/status`, { status: newStatus });
      await fetchAdmins();
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

  const filteredAdmins = useMemo(() => {
    return admins.filter(a => 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [admins, searchQuery]);

  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
  const paginatedAdmins = filteredAdmins.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAddAdmin = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/super-admin/add-admin", newAdmin, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) {
        fetchAdmins();
        if (refreshActivities) refreshActivities();
        setNewAdmin({ name: "", email: "", password: "", hospital_id: "" });
      }
    } catch (error) { console.error(error); }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Admin Management</h2>
        <p className="text-sm text-gray-500 font-medium">Assign and oversee hospital administrators across your network.</p>
      </div>

      {/* Add Admin Form */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#0b645b] p-2 rounded-lg text-white"><FiShield /></div>
          <h3 className="font-black text-gray-900">Register New Administrator</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input placeholder="Admin Full Name" className="p-3 bg-gray-50 rounded-xl text-sm font-bold border border-transparent focus:border-[#0b645b] outline-none" value={newAdmin.name} onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })} />
          <input placeholder="Email Address" className="p-3 bg-gray-50 rounded-xl text-sm font-bold border border-transparent focus:border-[#0b645b] outline-none" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} />
          <input type="password" placeholder="Temporary Password" className="p-3 bg-gray-50 rounded-xl text-sm font-bold border border-transparent focus:border-[#0b645b] outline-none" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} />
          <select className="p-3 bg-gray-50 rounded-xl text-sm font-bold border border-transparent focus:border-[#0b645b] outline-none" value={newAdmin.hospital_id} onChange={(e) => setNewAdmin({ ...newAdmin, hospital_id: e.target.value })}>
            <option value="">Select Hospital</option>
            {hospitals.map(h => <option key={h._id} value={h._id}>{h.hospital_name}</option>)}
          </select>
        </div>
        <button onClick={handleAddAdmin} className="mt-6 w-full md:w-auto px-8 py-3 bg-[#0b645b] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#084e46]">
          <FiPlus /> Register Admin
        </button>
      </div>

      {/* Admin List */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-black flex items-center gap-2">Registered Admins <span className="bg-gray-100 px-2 py-0.5 rounded-md text-xs text-gray-500">{filteredAdmins.length}</span></h2>
          <div className="relative">
            <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
            <input placeholder="Search admins..." className="pl-10 pr-4 py-2 bg-gray-50 rounded-xl text-sm font-bold outline-none border border-transparent focus:border-[#0b645b]" value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}} />
          </div>
        </div>

        <div className="space-y-4">
          {paginatedAdmins.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-3xl">
              <FiAlertCircle className="mx-auto text-gray-300 mb-3" size={32} />
              <p className="text-gray-400 font-bold">No admins found.</p>
            </div>
          ) : (
            paginatedAdmins.map((admin) => (
              <div key={admin._id} className="group flex items-center justify-between p-5 bg-gray-50 hover:bg-white border border-gray-100 hover:shadow-md rounded-2xl transition-all">
                <div className="flex items-center gap-4">
                  <div className="bg-[#0b645b]/10 p-4 rounded-full text-[#0b645b]"><FiUser /></div>
                  <div>
                    <p className="text-sm font-black text-gray-900">{admin.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">{admin.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-[10px] font-bold text-gray-500 flex items-center gap-2"><FiBriefcase /> {hospitals.find(h => h._id === admin.hospital_id)?.hospital_name || "Unassigned"}</div>
                  <StatusToggle status={admin.status} onToggle={() => toggleAdminStatus(admin)} />
                  <button className="text-gray-300 hover:text-red-500 transition"><FiTrash2 /></button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 pt-8 border-t border-gray-100 mt-6">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(1)} className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-20"><FiChevronsLeft /></button>
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-20"><FiChevronLeft /></button>
            <span className="text-xs font-black text-gray-400 uppercase w-20 text-center">{currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-20"><FiChevronRight /></button>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)} className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-20"><FiChevronsRight /></button>
          </div>
        )}
      </div>
    </div>
  );
}