import { useState, useEffect } from "react";
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiDollarSign, FiChevronDown } from 'react-icons/fi';
import AdminDoctors from './AdminDoctors';
import AdminStaff from './AdminStaff';
import AdminPatient from './AdminPatient';
import api from "../services/api";

export default function AdminDashboard({ activeTab = "Dashboard", onNavigate }) {
  const [dashboardStats, setDashboardStats] = useState({
    doctors: 0,
    staff: 0,
    patients: 0
  });

  const [revenueData, setRevenueData] = useState({
    total_revenue: 0,
    doctor_revenue: []
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState("daily");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    fetchRevenue();
  }, [selectedDate, viewMode]);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get("/admin/dashboard-stats");
      setDashboardStats(response.data.data);
    } catch (error) { console.error(error); }
  };

  const fetchRevenue = async () => {

    try {

      let url = `/admin/revenue-stats?mode=${viewMode}`;

      if (viewMode !== "all") {
        url += `&date=${selectedDate}`;
      }

      const response = await api.get(url);

      setRevenueData(
        response.data.data
      );

    }

    catch (error) {

      console.error(error);

    }

  };

  const changeDate = (amount) => {
    const d =
      viewMode === "monthly"
        ? new Date(`${selectedDate}-01`)
        : new Date(selectedDate);
    if (viewMode === "daily") {
      d.setDate(d.getDate() + amount);
      setSelectedDate(d.toISOString().split("T")[0]);
    }

    if (viewMode === "monthly") {
      d.setMonth(d.getMonth() + amount);
      setSelectedDate(d.toISOString().slice(0, 7));
    }
  };

  const stats = [
    { label: "Total Doctors", count: dashboardStats.doctors, tab: "Doctors" },
    { label: "Active Staff", count: dashboardStats.staff, tab: "Staff" },
    { label: "Total Patients", count: dashboardStats.patients ?? 0, tab: "Patients" },
  ];

  const formatDisplayDate = () => {

    if (viewMode === "all") {
      return "All Time";
    }

    const date = new Date(selectedDate);

    if (viewMode === "daily") {
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
    }

    return date.toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric"
    });

  };

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-gray-900">Admin Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat) => (
                <button key={stat.label} onClick={() => onNavigate(stat.tab)} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-left transition-transform hover:scale-[1.02] group flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">{stat.label}</p>
                    <p className="text-4xl font-black mt-2 text-gray-900">{stat.count}</p>
                  </div>
                  <div className="bg-gray-100 p-2 rounded-full text-gray-600"><FiArrowRight size={20} /></div>
                </button>
              ))}
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <FiDollarSign className="text-teal-600" /> Revenue Analytics
                </h3>

                {/* Responsive container for controls */}
                <div className="flex flex-col-reverse md:flex-row items-center gap-3 w-full md:w-auto">
                  {/* Date navigation appears only in daily mode */}
                  {viewMode !== "all" && (
                    <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl w-full md:w-auto justify-center">
                      <button onClick={() => changeDate(-1)} className="p-2 hover:bg-white rounded-lg"><FiChevronLeft size={16} /></button>
                      <span className="text-xs font-black w-32 text-center">
                        {formatDisplayDate()}
                      </span>
                      <button onClick={() => changeDate(1)} className="p-2 hover:bg-white rounded-lg"><FiChevronRight size={16} /></button>
                    </div>
                  )}
                  <select
                    value={viewMode}
                    onChange={(e) => {

                      const mode = e.target.value;

                      setViewMode(mode);

                      const today = new Date();

                      if (mode === "daily") {
                        setSelectedDate(
                          today.toISOString().split("T")[0]
                        );
                      }

                      else if (mode === "monthly") {
                        setSelectedDate(
                          today.toISOString().slice(0, 7)
                        );
                      }

                      else {
                        setSelectedDate("");
                      }

                    }}
                    className="bg-gray-50 px-4 py-2 rounded-xl font-bold text-xs outline-none"
                  >

                    <option value="daily">
                      Daily View
                    </option>

                    <option value="monthly">
                      Monthly View
                    </option>

                    <option value="all">
                      All Time
                    </option>

                  </select>
                </div>
              </div>

              <div className="p-6 bg-teal-50 rounded-2xl mb-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-bold text-teal-800">Total Revenue</p>
                  <p className="text-2xl font-black text-teal-900">₹{revenueData.total_revenue}</p>
                </div>
              </div>

              <button onClick={() => setExpanded(!expanded)} className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-xl font-bold text-sm text-gray-600">
                View Individual Doctor Performance <FiChevronDown className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
              </button>

              {expanded && (
                <div className="mt-4 space-y-2 animate-in slide-in-from-top-2">
                  {revenueData.doctor_revenue.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex justify-between p-4 border border-gray-100 rounded-xl text-sm font-bold"
                    >
                      <span>{doc.name}</span>

                      <span className="text-teal-600">
                        ₹{doc.revenue}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div >
        );
      case "Doctors": return <AdminDoctors />;
      case "Staff": return <AdminStaff />;
      case "Patients": return <AdminPatient />;
      default: return null;
    }
  };

  return <div className="max-w-7xl mx-auto px-4 sm:px-10 py-10">{renderContent()}</div>;
}