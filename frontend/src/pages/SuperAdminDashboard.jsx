import { FiArrowRight, FiClock, FiActivity, FiHome, FiUser, FiDollarSign } from 'react-icons/fi';
import HospitalsView from './HospitalsView';
import AdminsView from './AdminsView';
import RevenueView from './RevenueView';
import { useState, useEffect } from "react";
import api from "../services/api";

export default function SuperAdminDashboard({
  activeTab = "Dashboard",
  hospitals = [],
  fetchHospitals,
  onNavigate,
}) {

  const [stats, setStats] = useState({
    total_hospitals: 0,
    active_admins: 0,
    total_revenue: 0,
  });

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchDashboardStats();
    fetchRecentActivities();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get("/super-admin/dashboard-revenue");
      setStats(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRecentActivities = async () => {

    try {

      const response = await api.get(
        "/super-admin/recent-activities"
      );

      setActivities(
        response.data.data.slice(0, 3)
      );


    } catch (error) {

      console.error(
        "Failed to load activities",
        error
      );

    }

  };

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Administrative Overview</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Total Hospitals */}
              <button
                onClick={() => onNavigate("Hospitals")}
                className="bg-[#0b645b] p-8 rounded-3xl text-white shadow-lg text-left transition-transform hover:scale-[1.02] active:scale-95 group flex flex-col justify-between h-40"
              >
                <div className="flex items-center gap-3 opacity-90">
                  <FiHome size={20} />
                  <p className="text-xs font-bold uppercase tracking-wider">Total Hospitals</p>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-4xl font-black">{stats.total_hospitals}</p>
                  <FiArrowRight size={24} className="opacity-50" />
                </div>
              </button>

              {/* Active Admins */}
              <button
                onClick={() => onNavigate("Admins")}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-left transition-transform hover:scale-[1.02] active:scale-95 group flex flex-col justify-between h-40"
              >
                <div className="flex items-center gap-3 text-gray-400">
                  <FiUser size={20} />
                  <p className="text-xs font-bold uppercase tracking-wider">Active Admins</p>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-4xl font-black text-gray-900">{stats.active_admins}</p>
                  <FiArrowRight size={24} className="text-gray-300" />
                </div>
              </button>

              {/* Total Revenue */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-40">
                <div className="flex items-center gap-3 text-gray-400">
                  <FiDollarSign size={20} />
                  <p className="text-xs font-bold uppercase tracking-wider">Total Revenue</p>
                </div>
                <p className="text-3xl sm:text-4xl font-black text-gray-900 truncate">
                  ${stats.total_revenue.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-black text-gray-900 mb-6">Recent System Activity</h3>
              <div className="space-y-4">
                {activities.length > 0 ? activities.map((activity, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-2xl gap-3">
                    <div className="flex items-center gap-4">
                      <div className="text-[#0b645b] bg-[#0b645b]/10 p-3 rounded-xl shrink-0">
                        <FiActivity size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{activity.description}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{activity.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 sm:self-center">
                      <FiClock size={14} />
                      {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500 text-sm">No recent activity to display.</p>
                )}
              </div>
            </div>
          </div>
        );
      case "Hospitals":
        return (
          <HospitalsView
            hospitals={hospitals}
            fetchHospitals={fetchHospitals}
            refreshActivities={fetchRecentActivities}
          />
        );
      case "Admins": return <AdminsView hospitals={hospitals} />;
      case "Revenue": return <RevenueView />;
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-10 py-6 sm:py-10">
      {renderContent()}
    </div>
  );
}