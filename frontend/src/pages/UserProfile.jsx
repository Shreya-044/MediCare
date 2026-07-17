import { useState } from "react";
import { FiUser, FiMail, FiPhone, FiEdit, FiSave, FiAlertCircle, FiActivity } from "react-icons/fi";

export default function UserProfile({ userName, userEmail }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: userName || "",
    email: userEmail || "",
    phone: "",
    allergies: "",
    history: "",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-3xl mx-auto px-10 py-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-gray-900">My Profile</h2>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-6 py-2 bg-[#0b645b] text-white rounded-full text-xs font-bold hover:bg-[#084e46] transition"
        >
          {isEditing ? <><FiSave /> Save Details</> : <><FiEdit /> Edit Profile</>}
        </button>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        {[
          { label: "Full Name", name: "name", icon: <FiUser /> },
          { label: "Email Address", name: "email", icon: <FiMail /> },
          { label: "Phone Number", name: "phone", icon: <FiPhone /> },
          { label: "Allergies", name: "allergies", icon: <FiAlertCircle /> },
          { label: "Medical History", name: "history", icon: <FiActivity /> },
        ].map((field) => (
          <div key={field.name} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
            <div className="text-[#0b645b]">{field.icon}</div>
            <div className="w-full">
              <p className="text-[10px] font-black text-gray-400 uppercase">{field.label}</p>
              {isEditing ? (
                <input 
                  name={field.name}
                  value={profile[field.name]}
                  onChange={handleChange}
                  placeholder={`Add ${field.label.toLowerCase()}...`}
                  className="w-full bg-transparent border-b border-[#0b645b] outline-none text-sm font-bold text-gray-900 placeholder:text-gray-300"
                />
              ) : (
                <p className="text-sm font-bold text-gray-900">
                  {profile[field.name] || <span className="text-gray-300 font-normal italic">Not provided</span>}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}