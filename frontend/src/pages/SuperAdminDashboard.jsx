import { FiArrowRight, FiClock, FiActivity } from 'react-icons/fi';
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
      const response = await api.get("/super-admin/dashboard-stats");
      setStats(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRecentActivities = async () => {
  try {
    const response = await api.get("/super-admin/recent-activities");
    console.log("Fetched Activities:", response.data.data);
    setActivities(response.data.data.slice(0, 3)); 
  } catch (error) {
    console.error(error);
  }
};

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-gray-900">Admin Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => onNavigate("Hospitals")}
                className="bg-[#0b645b] p-6 rounded-3xl text-white shadow-lg text-left transition-transform hover:scale-[1.02] active:scale-95 group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold opacity-80 uppercase">Total Hospitals</p>
                    <p className="text-4xl font-black mt-2">{stats.total_hospitals}</p>
                  </div>
                  <div className="bg-white/10 p-2 rounded-full group-hover:bg-white/20 transition-colors">
                    <FiArrowRight size={20} />
                  </div>
                </div>
              </button>

              <button
                onClick={() => onNavigate("Admins")}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-left transition-transform hover:scale-[1.02] active:scale-95 group flex justify-between items-start"
              >
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Active Admins</p>
                  <p className="text-4xl font-black mt-2 text-gray-900">{stats.active_admins}</p>
                </div>
                <div className="bg-gray-100 p-2 rounded-full group-hover:bg-gray-200 transition-colors text-gray-600">
                  <FiArrowRight size={20} />
                </div>
              </button>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase">Total Revenue</p>
                <p className="text-4xl font-black mt-2 text-gray-900">
                  ${stats.total_revenue.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-black text-gray-900 mb-6">Recent System Activity</h3>
              <div className="space-y-4">
                {activities.length > 0 ? activities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="text-[#0b645b] bg-[#0b645b]/10 p-3 rounded-xl">
                        <FiActivity size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{activity.description}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{activity.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
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
    <div className="max-w-7xl mx-auto px-10 py-10">
      {renderContent()}
    </div>
  );
}