import { useState, useEffect, useMemo } from "react";
import api from "../services/api";

import {
  FiUser,
  FiMail,
  FiEdit,
  FiSave,
  FiShield,
  FiLayers,
  FiBriefcase,
  FiDollarSign,
  FiClock,
  FiActivity,
  FiX
} from "react-icons/fi";

export default function UserProfile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [profile, setProfile] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) return;

    setCurrentUser(storedUser);

    setProfile({
      ...storedUser,
      _id: storedUser._id || storedUser.id
    });
  }, []);

  const role = currentUser?.role;

  /*
  ------------------------------------
  FIELDS ACCORDING TO BACKEND
  ------------------------------------
  */

  const fields = useMemo(() => {
    if (role === "doctor") {
      return [
        {
          label: "Full Name",
          name: "name",
          icon: <FiUser size={18} />,
          type: "text"
        },
        {
          label: "Email Address",
          name: "email",
          icon: <FiMail size={18} />,
          type: "email"
        },
        {
          label: "Department",
          name: "department",
          icon: <FiLayers size={18} />,
          type: "text"
        },
        {
          label: "Designation",
          name: "designation",
          icon: <FiBriefcase size={18} />,
          type: "text"
        },
        {
          label: "Consultation Fee",
          name: "consultation_fee",
          icon: <FiDollarSign size={18} />,
          type: "number"
        },
        {
          label: "Experience",
          name: "experience",
          icon: <FiClock size={18} />,
          type: "number"
        },
        {
          label: "Available Slots",
          name: "available_slots",
          icon: <FiActivity size={18} />,
          type: "text"
        }
      ];
    }

    if (role === "staff") {
      return [
        {
          label: "Full Name",
          name: "name",
          icon: <FiUser size={18} />,
          type: "text"
        },
        {
          label: "Email Address",
          name: "email",
          icon: <FiMail size={18} />,
          type: "email"
        },
        {
          label: "Designation",
          name: "designation",
          icon: <FiBriefcase size={18} />,
          type: "text"
        }
      ];
    }

    return [
      {
        label: "Full Name",
        name: "name",
        icon: <FiUser size={18} />,
        type: "text"
      },
      {
        label: "Email Address",
        name: "email",
        icon: <FiMail size={18} />,
        type: "email"
      }
    ];
  }, [role]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancel = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    setProfile({
      ...storedUser,
      _id: storedUser._id || storedUser.id
    });

    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const id = profile._id || profile.id;

      if (!id) {
        alert("User ID not found.");
        return;
      }

      let endpoint = "";

      if (role === "doctor") {
        endpoint = `/admin/update-doctor/${id}`;
      } else if (role === "staff") {
        endpoint = `/admin/update-staff/${id}`;
      } else {
        alert("Profile update is not available for this role.");
        return;
      }

      /*
      ------------------------------------
      SEND ONLY BACKEND-ALLOWED FIELDS
      ------------------------------------
      */

      let updateData = {};

      if (role === "doctor") {
        updateData = {
          name: profile.name,
          email: profile.email,
          department: profile.department,
          designation: profile.designation,
          consultation_fee: Number(profile.consultation_fee),
          experience: Number(profile.experience),
          available_slots: profile.available_slots
        };
      }

      if (role === "staff") {
        updateData = {
          name: profile.name,
          email: profile.email,
          designation: profile.designation
        };
      }

      const response = await api.put(endpoint, updateData);

      if (response.data.success) {
        alert(response.data.message || "Profile updated successfully.");

        /*
        Update localStorage with new profile values
        */

        const updatedUser = {
          ...currentUser,
          ...profile,
          _id: id
        };

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );

        setCurrentUser(updatedUser);
        setProfile(updatedUser);
        setIsEditing(false);
      }

    } catch (error) {
      console.error("Profile update error:", error);

      alert(
        error.response?.data?.message ||
        "Profile update failed."
      );

    } finally {
      setIsSaving(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="p-10 text-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-10 py-10 animate-in fade-in duration-300">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">

        <div>
          <h2 className="text-2xl font-black text-gray-900">
            My Profile
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Manage your personal and professional information
          </p>
        </div>

        {!isEditing ? (

          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-2 bg-[#0b645b] text-white rounded-full text-xs font-bold hover:bg-[#084e46] transition shadow-md"
          >
            <FiEdit />
            Edit Profile
          </button>

        ) : (

          <div className="flex gap-3">

            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-5 py-2 bg-gray-200 text-gray-700 rounded-full text-xs font-bold hover:bg-gray-300 transition"
            >
              <FiX />
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-[#0b645b] text-white rounded-full text-xs font-bold hover:bg-[#084e46] transition shadow-md disabled:opacity-50"
            >
              <FiSave />
              {isSaving ? "Saving..." : "Save Details"}
            </button>

          </div>

        )}

      </div>


      {/* PROFILE CARD */}

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">

        {/* ROLE */}

        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">

          <div className="text-[#0b645b] bg-[#0b645b]/10 p-3 rounded-xl">
            <FiShield size={18} />
          </div>

          <div>

            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
              System Role
            </p>

            <span className="inline-block mt-1 bg-[#0b645b]/10 text-[#0b645b] text-[10px] font-black px-3 py-1 rounded-full uppercase">
              {role?.replace("_", " ")}
            </span>

          </div>

        </div>


        {/* FIELDS */}

        {fields.map((field) => (

          <div
            key={field.name}
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl"
          >

            <div className="text-[#0b645b] bg-[#0b645b]/10 p-3 rounded-xl">
              {field.icon}
            </div>

            <div className="w-full">

              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                {field.label}
              </p>

              {isEditing ? (

                <input
                  name={field.name}
                  type={field.type}
                  value={profile[field.name] ?? ""}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b-2 border-[#0b645b]/30 focus:border-[#0b645b] outline-none text-sm font-bold text-gray-900 py-1"
                />

              ) : (

                <div className="text-sm font-bold text-gray-900 mt-1">

                  {profile[field.name] !== undefined &&
                  profile[field.name] !== null &&
                  profile[field.name] !== "" ? (

                    profile[field.name]

                  ) : (

                    <span className="text-gray-300 font-normal italic text-xs">
                      Not provided
                    </span>

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