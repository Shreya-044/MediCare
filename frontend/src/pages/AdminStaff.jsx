import { useState, useEffect, useMemo } from "react";
import {
  FiPlus, FiX, FiSearch, FiChevronLeft, FiChevronRight,
  FiChevronsLeft, FiChevronsRight, FiUser, FiDollarSign, FiEdit2
} from "react-icons/fi";
import api from "../services/api";

export default function AdminStaff() {
  const [showForm, setShowForm] = useState(false);
  const [staff, setStaff] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [activePage, setActivePage] = useState(1);
  const [inactivePage, setInactivePage] = useState(1);

  const [editingStaff, setEditingStaff] = useState(null);

  const emptyStaff = {
    name: "",
    email: "",
    password: "",
    designation: "",
    salary: "",
    dob: ""
  };

  const [formData, setFormData] = useState(emptyStaff);

  const fieldLabels = {
    name: "Staff Name", email: "Email Address", password: "Password",
    designation: "Designation", salary: "Salary", dob: "Date of Birth"
  };

  useEffect(() => {
    const handleResize = () => setItemsPerPage(window.innerWidth < 640 ? 3 : 4);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => { fetchStaff(); }, []);

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/admin/staff", { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) setStaff(response.data.data);
    } catch (err) { console.error(err); }
  };

  const openEditStaff = (staff) => {
    setEditingStaff(staff);

    setFormData({
      name: staff.name,
      email: staff.email,
      password: "",
      designation: staff.designation,
      salary: staff.salary,
      dob: staff.dob || "",
    });

    setShowForm(true);
  };

  const addStaff = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = { ...formData, status: "active" };
      const response = await api.post("/admin/add-staff", payload, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) {
        fetchStaff();
        setShowForm(false);
        setFormData(emptyStaff);
        setEditingStaff(null);
      }
    } catch (err) { console.error(err); }
  };

  const updateStaff = async () => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        name: formData.name,
        email: formData.email,
        designation: formData.designation,
        salary: formData.salary,
        dob: formData.dob,
      };

      const response = await api.put(
        `/admin/update-staff/${editingStaff._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        fetchStaff();
        setEditingStaff(null);
        setShowForm(false);
        setFormData(emptyStaff);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (s) => {
    const token = localStorage.getItem("token");
    const newStatus = s.status === "active" ? "inactive" : "active";
    try {
      await api.put(`/admin/update-staff/${s._id}`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
      fetchStaff();
    } catch (err) { console.error(err); }
  };

  const activeStaff = useMemo(() => staff.filter(s => (s.status === 'active' || !s.status) && s.name.toLowerCase().includes(searchQuery.toLowerCase())), [staff, searchQuery]);
  const inactiveStaff = useMemo(() => staff.filter(s => s.status === 'inactive' && s.name.toLowerCase().includes(searchQuery.toLowerCase())), [staff, searchQuery]);

  const StatusToggle = ({ status, onToggle }) => (
    <button onClick={onToggle} className={`relative flex items-center h-7 w-14 rounded-full transition-all duration-300 ${status === 'active' ? 'bg-[#0b645b]' : 'bg-slate-200'}`}>
      <div className={`absolute top-1 left-1 bg-white h-5 w-5 rounded-full shadow-sm transition-transform duration-300 ${status === 'active' ? 'translate-x-7' : 'translate-x-0'}`} />
    </button>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Manage Staff</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">Add and manage hospital administrative staff.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-[#0b645b] text-white p-4 rounded-2xl shadow-lg hover:bg-[#084e46] transition-transform active:scale-95">
          {showForm ? <FiX size={20} /> : <FiPlus size={20} />}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xl animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-teal-50 p-3 rounded-2xl text-[#0b645b]"><FiUser size={20} /></div>
            <h3 className="font-black text-slate-900 text-lg">
              {editingStaff ? "Edit Staff" : "Register New Staff"}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(formData)
              .filter(key => !(editingStaff && key === "password"))
              .map((key) => (
                <input key={key} placeholder={fieldLabels[key]} type={key === 'password' ? 'password' : key === 'dob' ? 'date' : 'text'} className="p-4 bg-slate-50 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-[#0b645b] outline-none transition" value={formData[key]} onChange={e => setFormData({ ...formData, [key]: e.target.value })} />
              ))}
          </div>
          <button
            onClick={editingStaff ? updateStaff : addStaff}
            className="mt-6 w-full px-8 py-4 bg-[#0b645b] text-white rounded-2xl font-black text-sm hover:bg-[#084e46] transition-transform active:scale-95"
          >
            {editingStaff ? "Update Staff" : "Save Staff Profile"}
          </button>
        </div>
      )}

      <div className="relative w-full">
        <FiSearch className="absolute left-5 top-5 text-slate-400" size={18} />
        <input placeholder="Search staff by name or email..." className="w-full pl-14 pr-12 py-5 bg-white rounded-3xl text-sm font-bold border border-slate-100 shadow-sm outline-none focus:border-[#0b645b] transition" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setActivePage(1); setInactivePage(1); }} />
        {searchQuery && <button onClick={() => { setSearchQuery(""); setActivePage(1); setInactivePage(1); }} className="absolute right-5 top-5 text-slate-400 hover:text-slate-600"><FiX size={20} /></button>}
      </div>

      {[{ list: activeStaff.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage), fullList: activeStaff, page: activePage, setPage: setActivePage, total: Math.ceil(activeStaff.length / itemsPerPage) || 1, title: "Active Staff" },
      { list: inactiveStaff.slice((inactivePage - 1) * itemsPerPage, inactivePage * itemsPerPage), fullList: inactiveStaff, page: inactivePage, setPage: setInactivePage, total: Math.ceil(inactiveStaff.length / itemsPerPage) || 1, title: "Inactive Staff" }].map((sec, i) => (
        <div key={i} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-black text-slate-800">{sec.title}</h2>
            <span className="text-[10px] font-bold bg-slate-50 border border-slate-100 px-3 py-1 rounded-full text-slate-500">{sec.fullList.length} Records</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sec.list.length === 0 ? <p className="col-span-full text-center py-10 text-slate-400 font-bold text-sm bg-slate-50 rounded-2xl">No {sec.title.toLowerCase()} found.</p> :
              sec.list.map(s => (
                <div key={s._id} className="group flex flex-col p-5 bg-white border border-slate-100 shadow-sm rounded-3xl gap-4 hover:border-[#0b645b]/20 transition-all">
                  <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                    <div className="bg-teal-50 p-4 rounded-2xl text-[#0b645b] shrink-0"><FiUser size={20} /></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-black text-slate-900 truncate">{s.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">{s.designation}</p>
                      <p className="text-xs text-slate-500 truncate">{s.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 text-[11px] bg-slate-50 p-4 rounded-2xl text-slate-600 font-bold">
                    <div className="flex items-center gap-2 flex-1"><FiDollarSign className="text-[#0b645b]" /> ₹{s.salary || "0"}</div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <button
                      onClick={() => openEditStaff(s)}
                      className="flex items-center gap-2 text-xs font-bold text-[#0b645b] hover:bg-teal-50 px-4 py-2 rounded-xl transition"
                    ><FiEdit2 /> Edit</button>
                    <StatusToggle status={s.status || 'active'} onToggle={() => toggleStatus(s)} />
                  </div>
                </div>
              ))}
          </div>
          {sec.total > 1 && (
            <div className="flex justify-center items-center gap-2 pt-8">
              <button disabled={sec.page === 1} onClick={() => sec.setPage(1)} className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-20"><FiChevronsLeft /></button>
              <button disabled={sec.page === 1} onClick={() => sec.setPage(p => p - 1)} className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-20"><FiChevronLeft /></button>
              <span className="text-[10px] w-16 text-center font-black text-slate-400 uppercase">{sec.page} of {sec.total}</span>
              <button disabled={sec.page === sec.total} onClick={() => sec.setPage(p => p + 1)} className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-20"><FiChevronRight /></button>
              <button disabled={sec.page === sec.total} onClick={() => sec.setPage(sec.total)} className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-20"><FiChevronsRight /></button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}