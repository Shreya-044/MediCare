import { useState, useEffect, useMemo } from "react";
import { 
  FiPlus, FiX, FiSearch, FiChevronLeft, FiChevronRight, 
  FiChevronsLeft, FiChevronsRight, FiUser, FiDollarSign, FiClock, FiEdit2
} from "react-icons/fi";
import api from "../services/api";

export default function AdminDoctors() {
  const [showForm, setShowForm] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [activePage, setActivePage] = useState(1);
  const [inactivePage, setInactivePage] = useState(1);

  const [formData, setFormData] = useState({
    name: "", email: "", password: "", department: "",
    designation: "", consultation_fee: "", experience: "", available_slots: "",
  });

  const fieldLabels = {
    name: "Doctor Name", email: "Email Address", password: "Password",
    department: "Department", designation: "Designation", consultation_fee: "Consultation Fee",
    experience: "Experience (Years)", available_slots: "Available Slots (comma separated)"
  };

  useEffect(() => {
    const handleResize = () => setItemsPerPage(window.innerWidth < 640 ? 3 : 4);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => { fetchDoctors(); }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/admin/doctors", { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) setDoctors(response.data.data);
    } catch (err) { console.error(err); }
  };

  const addDoctor = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...formData,
        consultation_fee: Number(formData.consultation_fee),
        experience: Number(formData.experience),
        available_slots: formData.available_slots.split(",").map(s => s.trim()).filter(s => s !== ""),
        status: "active",
      };
      const response = await api.post("/admin/add-doctor", payload, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) {
        fetchDoctors();
        setShowForm(false);
        setFormData({ name: "", email: "", password: "", department: "", designation: "", consultation_fee: "", experience: "", available_slots: "" });
      }
    } catch (err) { console.error(err); }
  };

  const toggleStatus = async (doctor) => {
    const token = localStorage.getItem("token");
    const newStatus = doctor.status === "active" ? "inactive" : "active";
    try {
      await api.put(`/admin/update-doctor/${doctor._id}`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
      fetchDoctors();
    } catch (err) { console.error(err); }
  };

  const activeDoctors = useMemo(() => doctors.filter(d => (d.status === 'active' || !d.status) && d.name.toLowerCase().includes(searchQuery.toLowerCase())), [doctors, searchQuery]);
  const inactiveDoctors = useMemo(() => doctors.filter(d => d.status === 'inactive' && d.name.toLowerCase().includes(searchQuery.toLowerCase())), [doctors, searchQuery]);

  const StatusToggle = ({ status, onToggle }) => (
    <button onClick={onToggle} className={`relative flex items-center h-7 w-14 rounded-full transition-all duration-300 ${status === 'active' ? 'bg-[#0b645b]' : 'bg-slate-200'}`}>
      <div className={`absolute top-1 left-1 bg-white h-5 w-5 rounded-full shadow-sm transition-transform duration-300 ${status === 'active' ? 'translate-x-7' : 'translate-x-0'}`} />
    </button>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Manage Doctors</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">Add and manage doctor's credentials.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-[#0b645b] text-white p-4 rounded-2xl shadow-lg hover:bg-[#084e46] transition-transform active:scale-95">
          {showForm ? <FiX size={20}/> : <FiPlus size={20}/>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xl animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-teal-50 p-3 rounded-2xl text-[#0b645b]"><FiUser size={20} /></div>
            <h3 className="font-black text-slate-900 text-lg">Register New Doctor</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.keys(formData).map((key) => (
              <input key={key} placeholder={fieldLabels[key]} type={key === 'password' ? 'password' : 'text'} className="p-4 bg-slate-50 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-[#0b645b] outline-none transition" value={formData[key]} onChange={e => setFormData({ ...formData, [key]: e.target.value })} />
            ))}
          </div>
          <button onClick={addDoctor} className="mt-6 w-full px-8 py-4 bg-[#0b645b] text-white rounded-2xl font-black text-sm hover:bg-[#084e46] transition-transform active:scale-95">Save Doctor Profile</button>
        </div>
      )}

      <div className="relative w-full">
        <FiSearch className="absolute left-5 top-5 text-slate-400" size={18} />
        <input placeholder="Search doctors by name..." className="w-full pl-14 pr-12 py-5 bg-white rounded-3xl text-sm font-bold border border-slate-100 shadow-sm outline-none focus:border-[#0b645b] transition" value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setActivePage(1); setInactivePage(1);}} />
        {searchQuery && <button onClick={() => {setSearchQuery(""); setActivePage(1); setInactivePage(1);}} className="absolute right-5 top-5 text-slate-400 hover:text-slate-600"><FiX size={20} /></button>}
      </div>

      {[ { list: activeDoctors.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage), fullList: activeDoctors, page: activePage, setPage: setActivePage, total: Math.ceil(activeDoctors.length / itemsPerPage) || 1, title: "Active Doctors" },
         { list: inactiveDoctors.slice((inactivePage - 1) * itemsPerPage, inactivePage * itemsPerPage), fullList: inactiveDoctors, page: inactivePage, setPage: setInactivePage, total: Math.ceil(inactiveDoctors.length / itemsPerPage) || 1, title: "Inactive Doctors" } ].map((sec, i) => (
        <div key={i} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-black text-slate-800">{sec.title}</h2>
            <span className="text-[10px] font-bold bg-slate-50 border border-slate-100 px-3 py-1 rounded-full text-slate-500">{sec.fullList.length} Records</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sec.list.length === 0 ? <p className="col-span-full text-center py-10 text-slate-400 font-bold text-sm bg-slate-50 rounded-2xl">No {sec.title.toLowerCase()} found.</p> :
              sec.list.map(d => (
                <div key={d._id} className="group flex flex-col p-5 bg-white border border-slate-100 shadow-sm rounded-3xl gap-4 hover:border-[#0b645b]/20 transition-all">
                  <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                    <div className="bg-teal-50 p-4 rounded-2xl text-[#0b645b] shrink-0"><FiUser size={20} /></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-black text-slate-900 truncate">{d.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                        {d.designation} 
                        <span className="block sm:inline sm:ml-1 font-bold">● {d.department}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 text-[11px] bg-slate-50 p-4 rounded-2xl text-slate-600 font-bold">
                    <div className="flex items-center gap-2 flex-1"><FiDollarSign className="text-[#0b645b]" /> ₹{d.consultation_fee}</div>
                    <div className="flex items-center gap-2 flex-1 truncate"><FiClock className="text-[#0b645b]" /> {d.experience} Yrs Exp</div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <button className="flex items-center gap-2 text-xs font-bold text-[#0b645b] hover:bg-teal-50 px-4 py-2 rounded-xl transition"><FiEdit2 /> Edit</button>
                    <StatusToggle status={d.status || 'active'} onToggle={() => toggleStatus(d)} />
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