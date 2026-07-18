import { useState, useEffect, useMemo } from "react";
import { 
  FiUser, FiMail, FiPhone, FiEdit, FiSave, FiAlertCircle, 
  FiActivity, FiShield, FiLayers, FiBriefcase 
} from "react-icons/fi";

export default function UserProfile({ userName, userEmail, userRole }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "", email: "", phone: "", role: "",
    systemId: "", department: "", allergies: "", history: "",
  });

  useEffect(() => {
    setProfile((prev) => ({
      ...prev,
      name: userName || prev.name,
      email: userEmail || prev.email,
      role: userRole || prev.role,
    }));
  }, [userName, userEmail, userRole]);

  // Use useMemo to prevent unnecessary recalculations of the fields array
  const fields = useMemo(() => {
    const isAdministrative = userRole === "super_admin" || userRole === "admin";
    
    const baseFields = [
      { label: "Full Name", name: "name", icon: <FiUser size={18} />, readOnly: false },
      { label: "Email Address", name: "email", icon: <FiMail size={18} />, readOnly: false },
      { label: "Phone Number", name: "phone", icon: <FiPhone size={18} />, readOnly: false },
    ];

    const adminFields = [
      { label: "System Role", name: "role", icon: <FiShield size={18} />, readOnly: true },
      { label: "Employee / System ID", name: "systemId", icon: <FiBriefcase size={18} />, readOnly: false },
      { label: "Department", name: "department", icon: <FiLayers size={18} />, readOnly: false },
    ];

    const patientFields = [
      { label: "Allergies", name: "allergies", icon: <FiAlertCircle size={18} />, readOnly: false },
      { label: "Medical History", name: "history", icon: <FiActivity size={18} />, readOnly: false },
    ];

    return isAdministrative ? [...baseFields, ...adminFields] : [...baseFields, ...patientFields];
  }, [userRole]);

  const handleChange = (e) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Add logic here to save to your database/API
    console.log("Saving profile:", profile);
  };

  return (
    <div className="max-w-3xl mx-auto px-10 py-10 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-gray-900">My Profile</h2>
        <button 
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className="flex items-center gap-2 px-6 py-2 bg-[#0b645b] text-white rounded-full text-xs font-bold hover:bg-[#084e46] transition shadow-md"
        >
          {isEditing ? <><FiSave /> Save Details</> : <><FiEdit /> Edit Profile</>}
        </button>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
            <div className="text-[#0b645b] bg-[#0b645b]/10 p-3 rounded-xl">
              {field.icon}
            </div>
            
            <div className="w-full">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{field.label}</p>
              
              {isEditing && !field.readOnly ? (
                <input 
                  name={field.name}
                  value={profile[field.name] || ""}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b-2 border-[#0b645b]/30 focus:border-[#0b645b] outline-none text-sm font-bold text-gray-900 py-1"
                />
              ) : (
                <div className="text-sm font-bold text-gray-900 mt-1">
                  {field.name === "role" ? (
                    <span className="bg-[#0b645b]/10 text-[#0b645b] text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                      {profile[field.name]?.replace("_", " ") || "No Role"}
                    </span>
                  ) : (
                    profile[field.name] || <span className="text-gray-300 font-normal italic text-xs">Not provided</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}