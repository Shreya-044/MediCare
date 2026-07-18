import { FiArrowRight } from 'react-icons/fi';
import HospitalsView from './HospitalsView';
import AdminsView from './AdminsView';
import RevenueView from './RevenueView';

export default function SuperAdminDashboard({
  activeTab = "Dashboard",
  hospitals = [],
  fetchHospitals,
  onNavigate,
}) {

  const totalHospitals = hospitals.length;
  const activeHospitals = hospitals.filter(h => h.status === 'active').length;
  const totalRevenue = hospitals.reduce((sum, h) => sum + (parseFloat(h.revenue) || 0), 0);

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-gray-900">Admin Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Clickable Total Hospitals Card */}
              <button
                onClick={() => onNavigate("Hospitals")}
                className="bg-[#0b645b] p-6 rounded-3xl text-white shadow-lg text-left transition-transform hover:scale-[1.02] active:scale-95 group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold opacity-80 uppercase">Total Hospitals</p>
                    <p className="text-4xl font-black mt-2">{totalHospitals}</p>
                  </div>
                  <div className="bg-white/10 p-2 rounded-full group-hover:bg-white/20 transition-colors">
                    <FiArrowRight size={20} />
                  </div>
                </div>
              </button>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase">Active Facilities</p>
                <p className="text-4xl font-black mt-2 text-gray-900">{activeHospitals}</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase">Total Revenue</p>
                <p className="text-4xl font-black mt-2 text-gray-900">${totalRevenue.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-black text-gray-900 mb-4">Recent System Activity</h3>
              <p className="text-gray-500 text-sm">Dashboard metrics updated in real-time based on hospital data.</p>
            </div>
          </div>
        );
      case "Hospitals": return <HospitalsView
        hospitals={hospitals}
        fetchHospitals={fetchHospitals}
      />;
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