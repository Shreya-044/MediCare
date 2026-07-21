import { useState, useEffect, useMemo } from "react";
import api from "../services/api";
import {
  FiUser, FiMail, FiEdit, FiSave, FiShield, FiLayers, FiBriefcase,
  FiDollarSign, FiClock, FiActivity, FiX, FiCamera, FiTrash2, FiCheckCircle, FiAlertCircle
} from "react-icons/fi";

export default function UserProfile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hospital, setHospital] = useState(null);
  const [hospitalImage, setHospitalImage] = useState(null);
  const [profile, setProfile] = useState({});
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  useEffect(() => {
    const loadProfile = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) return;
      const userId = storedUser._id || storedUser.id;
      setCurrentUser({ ...storedUser, _id: userId });
      try {
        let response;
        if (storedUser.role === "doctor") {
          response = await api.get(`/admin/doctor/${userId}`);
        } else if (storedUser.role === "staff") {
          response = await api.get(`/admin/staff/${userId}`);
        } else if (storedUser.role === "admin") {
          response = await api.get("/admin/hospital/profile");
          const hospitalData = response.data.data;
          setHospital(hospitalData);
          const adminProfile = { ...storedUser, _id: userId, hospital: hospitalData };
          setCurrentUser(adminProfile);
          setProfile(adminProfile);
          return;
        }
        const databaseProfile = response.data.data;
        const completeProfile = { ...storedUser, ...databaseProfile, _id: userId };
        setCurrentUser(completeProfile);
        setProfile(completeProfile);
        localStorage.setItem("user", JSON.stringify(completeProfile));
      } catch (error) {
        console.error("Failed to load profile:", error);
        setProfile({ ...storedUser, _id: userId });
      }
    };
    loadProfile();
  }, []);

  const role = currentUser?.role;

  const fields = useMemo(() => {
    if (role === "doctor") {
      return [
        { label: "Full Name", name: "name", icon: <FiUser size={18} />, type: "text" },
        { label: "Email Address", name: "email", icon: <FiMail size={18} />, type: "email" },
        { label: "Department", name: "department", icon: <FiLayers size={18} />, type: "text" },
        { label: "Designation", name: "designation", icon: <FiBriefcase size={18} />, type: "text" },
        { label: "Consultation Fee", name: "consultation_fee", icon: <FiDollarSign size={18} />, type: "number" },
        { label: "Experience", name: "experience", icon: <FiClock size={18} />, type: "number" },
        { label: "Available Slots", name: "available_slots", icon: <FiActivity size={18} />, type: "text" }
      ];
    }
    if (role === "staff") {
      return [
        { label: "Full Name", name: "name", icon: <FiUser size={18} />, type: "text" },
        { label: "Email Address", name: "email", icon: <FiMail size={18} />, type: "email" },
        { label: "Designation", name: "designation", icon: <FiBriefcase size={18} />, type: "text" }
      ];
    }
    return [
      { label: "Full Name", name: "name", icon: <FiUser size={18} />, type: "text" },
      { label: "Email Address", name: "email", icon: <FiMail size={18} />, type: "email" }
    ];
  }, [role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setProfile({ ...storedUser, _id: storedUser._id || storedUser.id });
    setHospitalImage(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      if (role === "admin") {
        if (hospitalImage) {
          const formData = new FormData();
          formData.append("image", hospitalImage);
          const response = await api.put("/admin/hospital/image", formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          if (response.data.success) {
            setHospital((prev) => ({ ...prev, image_url: response.data.image_url }));
            showNotification("Hospital image updated successfully.");
          }
        }
        setHospitalImage(null);
        setIsEditing(false);
        return;
      }
      const id = profile._id || profile.id;
      if (!id) return;
      let endpoint = role === "doctor" ? `/admin/update-doctor/${id}` : `/admin/update-staff/${id}`;
      let updateData = role === "doctor" 
        ? { name: profile.name, email: profile.email, department: profile.department, designation: profile.designation, consultation_fee: Number(profile.consultation_fee), experience: Number(profile.experience), available_slots: profile.available_slots }
        : { name: profile.name, email: profile.email, designation: profile.designation };
      const response = await api.put(endpoint, updateData);
      if (response.data.success) {
        showNotification("Profile updated successfully.");
        const updatedUser = { ...currentUser, ...profile, _id: id };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        setProfile(updatedUser);
        setIsEditing(false);
      }
    } catch (error) {
      showNotification(error.response?.data?.message || "Profile update failed.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-10 animate-in fade-in duration-300">
      {/* Modern Center-Aligned Notification Popup */}
      {notification.show && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-[200] w-[90%] sm:w-auto px-6 py-4 rounded-2xl shadow-2xl flex items-center justify-center gap-3 text-white bg-[#0b645b] animate-in slide-in-from-top-5">
          {notification.type === "error" ? <FiAlertCircle size={20} /> : <FiCheckCircle size={20} />}
          <p className="text-sm font-bold text-center">{notification.message}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">My Profile</h2>
          <p className="text-sm text-gray-400 mt-1">Manage personal and professional information</p>
        </div>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 py-2 bg-[#0b645b] text-white rounded-full text-xs font-bold hover:bg-[#084e46] transition shadow-md w-full sm:w-auto justify-center">
            <FiEdit /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-3 w-full sm:w-auto">
            <button onClick={handleCancel} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 bg-gray-200 text-gray-700 rounded-full text-xs font-bold hover:bg-gray-300 transition">
              <FiX /> Cancel
            </button>
            <button onClick={handleSave} disabled={isSaving} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-[#0b645b] text-white rounded-full text-xs font-bold hover:bg-[#084e46] transition shadow-md disabled:opacity-50">
              <FiSave /> {isSaving ? "Saving..." : "Save Details"}
            </button>
          </div>
        )}
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        {role === "admin" && (
          <div className="p-5 bg-gray-50 rounded-2xl flex flex-col items-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-4 w-full text-left">Hospital Image</p>
            <div className="w-full h-48 sm:h-64 rounded-2xl overflow-hidden bg-gray-200 flex items-center justify-center mb-4 border border-gray-100">
              {hospitalImage ? (
                <img src={URL.createObjectURL(hospitalImage)} alt="Preview" className="w-full h-full object-cover" />
              ) : hospital?.image_url ? (
                <img src={hospital.image_url} alt="Hospital" className="w-full h-full object-cover" />
              ) : (
                <FiCamera size={60} className="text-gray-400" />
              )}
            </div>
            {isEditing && (
              <div className="flex gap-2 w-full justify-center">
                <label className="cursor-pointer bg-[#0b645b] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#084e46]">
                  {hospitalImage || hospital?.image_url ? "Change Photo" : "Upload Photo"}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setHospitalImage(e.target.files[0])} />
                </label>
                {(hospital?.image_url || hospitalImage) && (
                  <button onClick={() => { setHospitalImage(null); setHospital({...hospital, image_url: null}) }} className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-100">
                    <FiTrash2 size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
          <div className="text-[#0b645b] bg-[#0b645b]/10 p-3 rounded-xl"><FiShield size={18} /></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">System Role</p>
            <span className="inline-block mt-1 bg-[#0b645b]/10 text-[#0b645b] text-[10px] font-black px-3 py-1 rounded-full uppercase">{role?.replace("_", " ")}</span>
          </div>
        </div>

        {fields.map((field) => (
          <div key={field.name} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
            <div className="text-[#0b645b] bg-[#0b645b]/10 p-3 rounded-xl shrink-0">{field.icon}</div>
            <div className="w-full overflow-hidden">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{field.label}</p>
              {isEditing ? (
                <input name={field.name} type={field.type} value={profile[field.name] ?? ""} onChange={handleChange} className="w-full bg-transparent border-b-2 border-[#0b645b]/30 focus:border-[#0b645b] outline-none text-sm font-bold text-gray-900 py-1" />
              ) : (
                <div className="text-sm font-bold text-gray-900 mt-1 truncate">{profile[field.name] || <span className="text-gray-300 font-normal italic text-xs">Not provided</span>}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}