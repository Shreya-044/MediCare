import { useState, useEffect } from "react";
import { FiArrowRight } from 'react-icons/fi';
import AdminDoctors from './AdminDoctors';
import AdminStaff from './AdminStaff';
import AdminPatient from './AdminPatient';
import api from "../services/api";

export default function AdminDashboard({ activeTab = "Dashboard", onNavigate }) {
  const [dashboardStats, setDashboardStats] = useState({
    doctors: 0,
    staff: 0,
    patients: 0,
  });

    useEffect(() => {
    fetchDashboardStats();
  }, []);


  const fetchDashboardStats = async () => {
    try {
      const response = await api.get("/admin/dashboard-stats");

      setDashboardStats(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const stats = [
    {
      label: "Total Doctors",
      count: dashboardStats.doctors,
      tab: "Doctors",
    },
    {
      label: "Active Staff",
      count: dashboardStats.staff,
      tab: "Staff",
    },
    {
      label: "Total Patients",
      count: dashboardStats.patients ?? 0,
      tab: "Patients",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-gray-900">Admin Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat) => (
                <button
                  key={stat.label}
                  onClick={() => onNavigate(stat.tab)}
                  className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-left transition-transform hover:scale-[1.02] active:scale-95 group flex justify-between items-start"
                >
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">{stat.label}</p>
                    <p className="text-4xl font-black mt-2 text-gray-900">{stat.count}</p>
                  </div>
                  <div className="bg-gray-100 p-2 rounded-full group-hover:bg-gray-200 transition-colors text-gray-600">
                    <FiArrowRight size={20} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case "Doctors": return <AdminDoctors />;
      case "Staff": return <AdminStaff />;
      case "Patients": return <AdminPatient />;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-10 py-10">
      {renderContent()}
    </div>
  );
}