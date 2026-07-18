import { useState } from "react";
import { FiUser, FiPlus, FiTrash2, FiShield, FiBriefcase, FiAlertCircle } from "react-icons/fi";

export default function AdminsView({ hospitals = [] }) {
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "", hospital_id: "" });

  const handleAddAdmin = () => {
    if (!newAdmin.name || !newAdmin.hospital_id || !newAdmin.password) return;
    setAdmins([...admins, { ...newAdmin, id: Date.now(), status: "active", created_at: new Date().toISOString() }]);
    setNewAdmin({ name: "", email: "", password: "", hospital_id: "" });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
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
          <input placeholder="Admin Full Name" className="p-3 bg-gray-50 rounded-xl text-sm font-bold border border-transparent focus:border-[#0b645b] outline-none transition" value={newAdmin.name} onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })} />
          <input placeholder="Email Address" className="p-3 bg-gray-50 rounded-xl text-sm font-bold border border-transparent focus:border-[#0b645b] outline-none transition" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} />
          <input type="password" placeholder="Temporary Password" className="p-3 bg-gray-50 rounded-xl text-sm font-bold border border-transparent focus:border-[#0b645b] outline-none transition" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} />
          <select className="p-3 bg-gray-50 rounded-xl text-sm font-bold border border-transparent focus:border-[#0b645b] outline-none transition" value={newAdmin.hospital_id} onChange={(e) => setNewAdmin({ ...newAdmin, hospital_id: e.target.value })}>
            <option value="">Select Hospital</option>
            {hospitals.map(h => <option key={h._id} value={h._id}>{h.hospital_name}</option>)}
          </select>
        </div>
        
        <button onClick={handleAddAdmin} className="mt-6 w-full md:w-auto px-8 py-3 bg-[#0b645b] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#084e46] transition-all">
          <FiPlus /> Register Admin
        </button>
      </div>

      {/* Admin List */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-black mb-6 flex items-center gap-2">Registered Admins <span className="bg-gray-100 px-2 py-0.5 rounded-md text-xs text-gray-500">{admins.length}</span></h2>
        
        <div className="space-y-4">
          {admins.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-3xl">
              <FiAlertCircle className="mx-auto text-gray-300 mb-3" size={32} />
              <p className="text-gray-400 font-bold">No administrators registered yet.</p>
            </div>
          ) : (
            admins.map((admin) => (
              <div key={admin.id} className="group flex items-center justify-between p-5 bg-gray-50 hover:bg-white border border-gray-100 hover:shadow-md rounded-2xl transition-all">
                <div className="flex items-center gap-4">
                  <div className="bg-[#0b645b]/10 p-4 rounded-full text-[#0b645b] group-hover:bg-[#0b645b] group-hover:text-white transition"><FiUser /></div>
                  <div>
                    <p className="text-sm font-black text-gray-900">{admin.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">{admin.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                    <FiBriefcase />
                    {hospitals.find(h => h._id === admin.hospital_id)?.hospital_name || "Unassigned"}
                  </div>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span> {admin.status}
                  </span>
                  <button className="text-gray-300 hover:text-red-500 transition"><FiTrash2 /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}