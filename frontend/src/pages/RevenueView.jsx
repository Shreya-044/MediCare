import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function RevenueView({ hospitals = [] }) {
  const [showDetails, setShowDetails] = useState(false);

  const totalRevenue = hospitals.reduce((sum, h) => sum + (parseFloat(h.revenue) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div 
        onClick={() => setShowDetails(!showDetails)}
        className="cursor-pointer p-6 bg-green-50 rounded-2xl border border-green-100 flex justify-between items-center transition-all hover:bg-green-100"
      >
        <div>
          <p className="text-xs font-black text-green-600 uppercase">Total Revenue</p>
          <p className="text-2xl font-black text-green-900">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="text-green-600">
          {showDetails ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
        </div>
      </div>

      {/* Details List - Always present, visibility controlled by state */}
      {showDetails && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-in slide-in-from-top-2 duration-300">
          <h3 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-widest">Revenue Breakdown</h3>
          <div className="space-y-3">
            {hospitals.map((hospital, index) => (
              <div key={index} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl">
                <span className="text-sm font-bold text-gray-700">{hospital.hospital_name}</span>
                <span className="text-sm font-black text-gray-900">${parseFloat(hospital.revenue || 0).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}