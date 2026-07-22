import { useState, useEffect, useMemo } from "react";
import {
  FiUser, FiPlus, FiShield, FiBriefcase, FiSearch,
  FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight, FiX, FiPhone, FiChevronDown, FiEdit2
} from "react-icons/fi";
import api from "../services/api";

export default function AdminsView({ hospitals = [], refreshActivities }) {
  const [admins, setAdmins] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [activePage, setActivePage] = useState(1);
  const [inactivePage, setInactivePage] = useState(1);

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    hospital_id: ""
  });

  const [editAdmin, setEditAdmin] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 640 ? 3 : 4);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <button
      onClick={onToggle}
      className={`relative flex items-center h-7 w-14 rounded-full transition-all duration-300 ${status === 'active' ? 'bg-[#0b645b]' : 'bg-slate-200'}`}
    >
      <div className={`absolute top-1 left-1 bg-white h-5 w-5 rounded-full shadow-sm transition-transform duration-300 ${status === 'active' ? 'translate-x-7' : 'translate-x-0'}`} />
    </button>
  );

  const activeAdmins = useMemo(() => admins.filter(a => (a.status === 'active' || !a.status) && (a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.email.toLowerCase().includes(searchQuery.toLowerCase()))), [admins, searchQuery]);
  const inactiveAdmins = useMemo(() => admins.filter(a => a.status === 'inactive' && (a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.email.toLowerCase().includes(searchQuery.toLowerCase()))), [admins, searchQuery]);

  const activeTotalPages = Math.ceil(activeAdmins.length / itemsPerPage) || 1;
  const inactiveTotalPages = Math.ceil(inactiveAdmins.length / itemsPerPage) || 1;

  const paginatedActive = activeAdmins.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);
  const paginatedInactive = inactiveAdmins.slice((inactivePage - 1) * itemsPerPage, inactivePage * itemsPerPage);

  const handleAddAdmin = async () => {
    try {

      let response;

      if (editAdmin) {

        response = await api.put(
          `/super-admin/update-admin/${editAdmin._id}`,
          {
            name: newAdmin.name,
            email: newAdmin.email,
            phone: newAdmin.phone,
            status: editAdmin.status
          }
        );

      } else {
        response = await api.post(
          "/super-admin/add-admin",
          newAdmin
        );

      }

      if (response.data.success) {

        fetchAdmins();

        if (refreshActivities)
          refreshActivities();

        setNewAdmin({
          name: "",
          email: "",
          password: "",
          phone: "",
          hospital_id: ""
        });

        setEditAdmin(null);

        setShowForm(false);

      }

    } catch (error) {

      console.error(error);

    }
  };

  const renderAdminList = (list, fullList, page, setPage, totalPages, isInactive = false) => {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base font-black text-slate-800">{isInactive ? "Inactive Admins" : "Registered Admins"}</h2>
          <span className="text-[10px] font-bold bg-slate-50 border border-slate-100 px-3 py-1 rounded-full text-slate-500">{fullList.length} Records</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.length === 0 ? (
            <div className="col-span-full text-center py-10 text-slate-400 font-bold text-sm bg-slate-50 rounded-2xl">No {isInactive ? "inactive" : "active"} admins found.</div>
          ) : (
            list.map((admin) => (
              <div key={admin._id} className="group flex flex-col p-5 bg-white border border-slate-100 shadow-sm rounded-3xl gap-4 hover:border-[#0b645b]/20 transition-all">
                <div className="flex flex-col items-center sm:flex-row sm:items-center gap-4 text-center sm:text-left">
                  <div className="bg-teal-50 p-4 rounded-2xl text-[#0b645b] shrink-0"><FiUser size={20} /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-slate-900 truncate">{admin.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider truncate">{admin.email}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-[11px] bg-slate-50 p-4 rounded-2xl text-slate-600 font-bold">
                  <div className="flex items-center gap-2 truncate"><FiPhone className="text-[#0b645b]" /> {admin.phone || "No phone"}</div>
                  <div className="flex items-center gap-2 truncate"><FiBriefcase className="text-[#0b645b]" /> {hospitals.find(h => h._id === admin.hospital_id)?.hospital_name || "Unassigned"}</div>
                </div>
                <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
                  <StatusToggle status={admin.status || 'active'} onToggle={() => toggleAdminStatus(admin)} />
                  <button
                    onClick={() => {

                      setEditAdmin(admin);

                      setNewAdmin({
                        name: admin.name,
                        email: admin.email,
                        password: "",
                        phone: admin.phone || "",
                        hospital_id: admin.hospital_id
                      });

                      setShowForm(true);

                    }}
                    className="text-slate-400 hover:text-[#0b645b] transition p-2 rounded-xl bg-slate-50"
                  >
                    <FiEdit2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-8">
            <button disabled={page === 1} onClick={() => setPage(1)} className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-20"><FiChevronsLeft /></button>
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-20"><FiChevronLeft /></button>
            <span className="text-[10px] w-16 text-center font-black text-slate-400 uppercase">{page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-20"><FiChevronRight /></button>
            <button disabled={page === totalPages} onClick={() => setPage(totalPages)} className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-20"><FiChevronsRight /></button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Admin Management</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">Oversee your administrator network.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-[#0b645b] text-white p-4 rounded-2xl shadow-lg hover:bg-[#084e46] transition-transform active:scale-95">
          {showForm ? <FiX size={20} /> : <FiPlus size={20} />}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xl animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-teal-50 p-3 rounded-2xl text-[#0b645b]"><FiShield size={20} /></div>
            <h3 className="font-black text-slate-900 text-lg">{editAdmin ? "Edit Administrator" : "Register New Administrator"}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input placeholder="Admin Name" className="p-4 bg-slate-50 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-[#0b645b] outline-none transition" value={newAdmin.name} onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })} />
            <input placeholder="Email Address" className="p-4 bg-slate-50 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-[#0b645b] outline-none transition" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} />
            <input placeholder="Phone Number" className="p-4 bg-slate-50 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-[#0b645b] outline-none transition" value={newAdmin.phone} onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })} />
            <input type="password" placeholder="Temporary Password" disabled={!!editAdmin} className="p-4 bg-slate-50 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-[#0b645b] outline-none transition" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} />

            <div className="col-span-1 sm:col-span-2 lg:col-span-4 relative group">
              <select
                disabled={!!editAdmin}
                className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-[#0b645b] outline-none transition appearance-none cursor-pointer group-hover:bg-slate-100"
                value={newAdmin.hospital_id}
                onChange={(e) => setNewAdmin({ ...newAdmin, hospital_id: e.target.value })}
              >
                <option value="" className="text-slate-400">Assign Hospital</option>
                {hospitals.map(h => <option key={h._id} value={h._id} className="font-bold text-slate-900">{h.hospital_name}</option>)}
              </select>
              <FiChevronDown className="absolute right-5 top-5 text-slate-400 pointer-events-none transition-transform group-hover:text-[#0b645b]" size={18} />
            </div>
          </div>
          <button onClick={handleAddAdmin} className="mt-6 w-full px-8 py-4 bg-[#0b645b] text-white rounded-2xl font-black text-sm hover:bg-[#084e46] transition-transform active:scale-95">{editAdmin ? "Update Administrator" : "Register Administrator"}</button>
        </div>
      )}

      <div className="relative w-full">
        <FiSearch className="absolute left-5 top-5 text-slate-400" size={18} />
        <input
          placeholder="Search admins by name or email..."
          className="w-full pl-14 pr-12 py-5 bg-white rounded-3xl text-sm font-bold border border-slate-100 shadow-sm outline-none focus:border-[#0b645b] transition"
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setActivePage(1); setInactivePage(1); }}
        />
        {searchQuery && (
          <button onClick={() => { setSearchQuery(""); setActivePage(1); setInactivePage(1); }} className="absolute right-5 top-5 text-slate-400 hover:text-slate-600">
            <FiX size={20} />
          </button>
        )}
      </div>

      {renderAdminList(paginatedActive, activeAdmins, activePage, setActivePage, activeTotalPages)}
      {renderAdminList(paginatedInactive, inactiveAdmins, inactivePage, setInactivePage, inactiveTotalPages, true)}
    </div>
  );
}