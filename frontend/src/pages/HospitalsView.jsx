import { useState, useEffect, useMemo } from "react";
import {
  FiPlus,
  FiEdit2,
  FiMapPin,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiBriefcase,
  FiHome,
  FiUser,
  FiPhone,
  FiX
} from "react-icons/fi";
import api from "../services/api";

export default function HospitalsView({ hospitals = [], admins = [], fetchHospitals, refreshActivities }) {
  const [showForm, setShowForm] = useState(false);
  const [editHospital, setEditHospital] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [activePage, setActivePage] = useState(1);
  const [inactivePage, setInactivePage] = useState(1);

  const [formData, setFormData] = useState({
    hospital_name: '', email: '', phone: '', emergency_phone: '',
    address: '', city: '', state: '', pincode: ''
  });

  const fieldLabels = {
    hospital_name: 'Hospital Name', email: 'Email Address', phone: 'Phone Number',
    emergency_phone: 'Emergency Phone', address: 'Address', city: 'City',
    state: 'State', pincode: 'Pincode'
  };

  useEffect(() => {
    const handleResize = () => setItemsPerPage(window.innerWidth < 640 ? 3 : 4);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeHospitals = useMemo(() =>
    hospitals.filter(h => (h.status === 'active' || !h.status) && h.hospital_name.toLowerCase().includes(searchQuery.toLowerCase())),
    [hospitals, searchQuery]
  );

  const inactiveHospitals = useMemo(() =>
    hospitals.filter(h => h.status === 'inactive' && h.hospital_name.toLowerCase().includes(searchQuery.toLowerCase())),
    [hospitals, searchQuery]
  );

  const toggleHospitalStatus = async (h) => {
    try {
      const newStatus = h.status === 'active' ? 'inactive' : 'active';
      await api.patch(`/super-admin/hospital/${h._id}/status`, { status: newStatus });
      await fetchHospitals();
      if (refreshActivities) refreshActivities();
    } catch (err) { console.error("Failed to toggle status:", err); }
  };

  const StatusToggle = ({ status, onToggle }) => (
    <button onClick={onToggle} className={`relative flex items-center h-7 w-14 rounded-full transition-all duration-300 ${status === 'active' ? 'bg-[#0b645b]' : 'bg-slate-200'}`}>
      <div className={`absolute top-1 left-1 bg-white h-5 w-5 rounded-full shadow-sm transition-transform duration-300 ${status === 'active' ? 'translate-x-7' : 'translate-x-0'}`} />
    </button>
  );

  const saveHospital = async () => {

    try {

      let response;


      if (editHospital) {

        response = await api.put(
          `/super-admin/update-hospital/${editHospital._id}`,
          formData
        );


      }
      else {


        response = await api.post(
          "/super-admin/add-hospital",
          formData
        );


      }



      if (response.data.success) {

        await fetchHospitals();


        if (refreshActivities)
          refreshActivities();


        setShowForm(false);
        setEditHospital(null);


        setFormData({
          hospital_name: '',
          email: '',
          phone: '',
          emergency_phone: '',
          address: '',
          city: '',
          state: '',
          pincode: ''
        });


      }


    }
    catch (error) {

      console.log(error);

    }

  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Hospital Management</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">Oversee your entire hospital facility network.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-[#0b645b] text-white p-4 rounded-2xl shadow-lg hover:bg-[#084e46] transition-transform active:scale-95">
          {showForm ? <FiX size={20} /> : <FiPlus size={20} />}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xl animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-teal-50 p-3 rounded-2xl text-[#0b645b]"><FiHome size={20} /></div>
            <h3>
              {editHospital ? "Edit Hospital" : "Register New Hospital"}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.keys(formData).map((key) => (
              <input key={key} placeholder={fieldLabels[key]} className="p-4 bg-slate-50 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-[#0b645b] outline-none transition" value={formData[key]} onChange={e => setFormData({ ...formData, [key]: e.target.value })} />
            ))}
          </div>
          <button onClick={saveHospital} className="mt-6 w-full px-8 py-4 bg-[#0b645b] text-white rounded-2xl font-black text-sm hover:bg-[#084e46] transition-transform active:scale-95">{editHospital ? "Update Hospital" : "Register Facility"}</button>
        </div>
      )}

      <div className="relative w-full">
        <FiSearch className="absolute left-5 top-5 text-slate-400" size={18} />
        <input placeholder="Search hospitals by name..." className="w-full pl-14 pr-12 py-5 bg-white rounded-3xl text-sm font-bold border border-slate-100 shadow-sm outline-none focus:border-[#0b645b] transition" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setActivePage(1); }} />
        {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-5 top-5 text-slate-400 hover:text-slate-600"><FiX size={20} /></button>}
      </div>

      {[{ list: activeHospitals.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage), fullList: activeHospitals, page: activePage, setPage: setActivePage, total: Math.ceil(activeHospitals.length / itemsPerPage) || 1, title: "Active Hospitals" },
      { list: inactiveHospitals.slice((inactivePage - 1) * itemsPerPage, inactivePage * itemsPerPage), fullList: inactiveHospitals, page: inactivePage, setPage: setInactivePage, total: Math.ceil(inactiveHospitals.length / itemsPerPage) || 1, title: "Inactive Hospitals" }].map((sec, i) => (
        <div key={i} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-black text-slate-800">{sec.title}</h2>
            <span className="text-[10px] font-bold bg-slate-50 border border-slate-100 px-3 py-1 rounded-full text-slate-500">{sec.fullList.length} Records</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sec.list.length === 0 ? <p className="col-span-full text-center py-10 text-slate-400 font-bold text-sm bg-slate-50 rounded-2xl">No {sec.title.toLowerCase()} found.</p> :
              sec.list.map(h => {
                const admin = admins.find(a => a.hospital_id === h._id);
                return (
                  <div key={h._id} className="group flex flex-col p-5 bg-white border border-slate-100 shadow-sm rounded-3xl gap-4 hover:border-[#0b645b]/20 transition-all">
                    <div className="flex flex-col items-center sm:flex-row sm:items-center gap-4 text-center sm:text-left">
                      <div className="bg-teal-50 p-4 rounded-2xl text-[#0b645b] shrink-0"><FiBriefcase size={20} /></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-black text-slate-900 truncate">{h.hospital_name}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider truncate">{h.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 text-[11px] bg-slate-50 p-4 rounded-2xl text-slate-600 font-bold">
                      <div className="flex items-center gap-2 truncate"><FiMapPin className="text-[#0b645b]" /> {h.city}, {h.state}</div>
                      <div className="flex items-center gap-2"><FiPhone className="text-[#0b645b]" /> {h.phone}</div>
                      <div className="flex items-center gap-2 truncate"><FiUser className="text-[#0b645b]" /> {admin ? admin.name : "Not Assigned"}</div>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">

                      <StatusToggle
                        status={h.status || "active"}
                        onToggle={() => toggleHospitalStatus(h)}
                      />

                      <button
                        onClick={() => {
                          setEditHospital(h);

                          setFormData({
                            hospital_name: h.hospital_name,
                            email: h.email,
                            phone: h.phone,
                            emergency_phone: h.emergency_phone || "",
                            address: h.address,
                            city: h.city,
                            state: h.state,
                            pincode: h.pincode,
                          });

                          setShowForm(true);
                        }}
                        className="text-slate-400 hover:text-[#0b645b] p-2 bg-slate-50 rounded-xl"
                      >
                        <FiEdit2 size={16} />
                      </button>

                    </div>
                  </div>
                )
              })}
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