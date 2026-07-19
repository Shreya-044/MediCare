import { useState, useMemo, useEffect } from "react";
import {
  FiPlus,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";
import api from "../services/api";

export default function AdminDoctors() {
  const [showForm, setShowForm] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 4;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    designation: "",
    consultation_fee: "",
    experience: "",
    available_slots: "",
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/admin/doctors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addDoctor = async () => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        ...formData,

        consultation_fee: Number(formData.consultation_fee),

        experience: Number(formData.experience),

        available_slots: formData.available_slots
          .split(",")
          .map((slot) => slot.trim())
          .filter((slot) => slot !== ""),

        status: "active",
      };

      const response = await api.post(
        "/admin/add-doctor",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        fetchDoctors();

        setShowForm(false);

        setFormData({
          name: "",
          email: "",
          password: "",
          department: "",
          designation: "",
          consultation_fee: "",
          experience: "",
          available_slots: "",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (doctor) => {
    const token = localStorage.getItem("token");

    const newStatus =
      doctor.status === "active" ? "inactive" : "active";

    try {
      await api.put(
        `/admin/update-doctor/${doctor._id}`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchDoctors();
    } catch (err) {
      console.error(err);
    }
  };

  const totalPages = Math.ceil(doctors.length / itemsPerPage);

  const paginatedDoctors = useMemo(() => {
    return doctors.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [doctors, currentPage]);

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm animate-in fade-in duration-500">

      <div className="flex justify-between items-center mb-8">

        <div>
          <h2 className="text-2xl font-black text-gray-900">
            Manage Doctors
          </h2>

          <p className="text-gray-500 text-sm">
            Add and manage medical staff credentials.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#0b645b] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#084d46]"
        >
          <FiPlus />

          {showForm ? "Close" : "Add New Doctor"}
        </button>

      </div>

      {showForm && (

        <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-3xl">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {Object.keys(formData).map((key) => (

              <div key={key}>

                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">

                  {key.replaceAll("_", " ")}

                </label>

                <input
                  type={
                    key === "password"
                      ? "password"
                      : key === "consultation_fee" ||
                        key === "experience"
                      ? "number"
                      : "text"
                  }
                  placeholder={
                    key === "available_slots"
                      ? "09:00 AM,10:00 AM,11:00 AM"
                      : ""
                  }
                  value={formData[key]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [key]: e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#0b645b]"
                />

              </div>

            ))}

            <button
              onClick={addDoctor}
              className="md:col-span-2 bg-[#0b645b] text-white py-3 rounded-xl font-bold hover:bg-[#084d46]"
            >
              Save Doctor Profile
            </button>

          </div>

        </div>

      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px]">

        {paginatedDoctors.map((doctor) => (

          <div
            key={doctor._id}
            className="p-6 border border-gray-100 rounded-2xl hover:shadow-md transition flex justify-between items-center"
          >

            <div className="flex items-center gap-4">

              <div
                className={`p-4 rounded-full ${
                  doctor.status === "active"
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <FiUser size={24} />
              </div>

              <div>

                <p className="font-black text-gray-900">
                  {doctor.name}
                </p>

                <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">
                  {doctor.designation} • {doctor.department}
                </p>

                <p className="text-xs text-gray-500">
                  {doctor.email}
                </p>

                <p className="text-xs font-bold text-[#0b645b] mt-1">
                  ₹{doctor.consultation_fee}
                </p>

              </div>

            </div>

            <button
              onClick={() => toggleStatus(doctor)}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                doctor.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {doctor.status}
            </button>

          </div>

        ))}

      </div>

      {totalPages > 1 && (

        <div className="flex justify-center items-center gap-4 pt-8 border-t border-gray-100 mt-8">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-20"
          >
            <FiChevronsLeft />
          </button>

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-20"
          >
            <FiChevronLeft />
          </button>

          <span className="text-xs font-black text-gray-400 uppercase tracking-widest w-20 text-center">
            {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-20"
          >
            <FiChevronRight />
          </button>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-20"
          >
            <FiChevronsRight />
          </button>

        </div>

      )}

    </div>
  );
}