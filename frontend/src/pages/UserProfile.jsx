import { useState, useEffect, useMemo } from "react";
import api from "../services/api";
import {
  FiUser, FiMail, FiPhone, FiEdit, FiSave, FiAlertCircle,
  FiActivity, FiShield, FiLayers, FiBriefcase, FiCalendar, FiClock
} from "react-icons/fi";

export default function UserProfile() {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const role = currentUser?.role;
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "", email: "", phone: "", role: "",
    systemId: "", department: "", allergies: "", history: "",
    dob: "", gender: "",
  });

  const age = useMemo(() => {
    if (!profile.dob) return "N/A";
    const birthDate = new Date(profile.dob);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    return calculatedAge;
  }, [profile.dob]);
  
  useEffect(() => {

    const loadProfile = async () => {

        const currentUser = JSON.parse(localStorage.getItem("user"));

        if (!currentUser) return;


        try {

            let profileData = {
                ...currentUser,
                _id: currentUser._id || currentUser.id
            };


            // Patient requires API fetch
            if (currentUser.role === "patient") {

                const response = await api.get(
                    `/patient/${profileData._id}`
                );

                profileData = response.data.data;

            }


            setProfile(profileData);


        } catch (err) {

            console.log(err);

        }

    };


    loadProfile();

}, []);
  const fields = useMemo(() => {
    const isAdministrative =
      role === "super_admin" ||
      role === "admin" ||
      role === "doctor" ||
      role === "staff";

    const baseFields = [
      { label: "Full Name", name: "name", icon: <FiUser size={18} />, readOnly: false },
      { label: "Email Address", name: "email", icon: <FiMail size={18} />, readOnly: false },
      { label: "Phone Number", name: "phone", icon: <FiPhone size={18} />, readOnly: false },
      { label: "Date of Birth", name: "dob", icon: <FiCalendar size={18} />, readOnly: false, type: "date" },
      { label: "Age", name: "age", icon: <FiClock size={18} />, readOnly: true },
      { label: "Gender", name: "gender", icon: <FiUser size={18} />, readOnly: false, type: "select", options: ["Male", "Female", "Other"] },
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
  }, [role]);

  const handleChange = (e) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {

    try {

        let response;


        const id = profile._id || profile.id;


        switch (role) {


            case "patient":

                response = await api.put(
                    `/patient/${id}`,
                    profile
                );

                break;



            case "doctor":

                response = await api.put(
                    `/admin/update-doctor/${id}`,
                    profile
                );

                break;



            case "staff":

                response = await api.put(
                    `/admin/update-staff/${id}`,
                    profile
                );

                break;



            case "admin":

                response = await api.put(
                    `/super-admin/update-admin/${id}`,
                    profile
                );

                break;



            case "super_admin":

                response = await api.put(
                    `/super-admin/update-profile/${id}`,
                    profile
                );

                break;



            default:

                return;

        }



        if (response.data.success) {


            alert("Profile Updated Successfully");


            setIsEditing(false);



            const updatedUser = {

                ...profile,

                ...response.data.data,

                _id: id

            };



            localStorage.setItem(
                "user",
                JSON.stringify(updatedUser)
            );



            setProfile(updatedUser);


        }



    } catch(err) {


        console.log(err);


        alert(
            err.response?.data?.message ||
            "Update Failed"
        );


    }

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
                field.type === "select" ? (
                  <select
                    name={field.name}
                    value={profile[field.name] || ""}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b-2 border-[#0b645b]/30 focus:border-[#0b645b] outline-none text-sm font-bold text-gray-900 py-1"
                  >
                    <option value="">Select Gender</option>
                    {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input
                    name={field.name}
                    type={field.type || "text"}
                    value={profile[field.name] || ""}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b-2 border-[#0b645b]/30 focus:border-[#0b645b] outline-none text-sm font-bold text-gray-900 py-1"
                  />
                )
              ) : (
                <div className="text-sm font-bold text-gray-900 mt-1">
                  {field.name === "role" ? (
                    <span className="bg-[#0b645b]/10 text-[#0b645b] text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                      {profile[field.name]?.replace("_", " ") || "No Role"}
                    </span>
                  ) : field.name === "age" ? (
                    age
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