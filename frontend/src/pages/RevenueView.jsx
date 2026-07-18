import { useState, useMemo, useEffect } from "react";
import { FiChevronDown, FiChevronUp, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from "react-icons/fi";

export default function RevenueView({ hospitals = [], fetchHospitals }) {
  const [showDetails, setShowDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Refresh data whenever this component mounts
  useEffect(() => {
    if (fetchHospitals) {
      fetchHospitals();
    }
  }, [fetchHospitals]);

  const totalRevenue = hospitals.reduce((sum, h) => sum + (parseFloat(h.revenue) || 0), 0);
  const totalPages = Math.ceil(hospitals.length / itemsPerPage);
  
  const paginatedHospitals = useMemo(() => {
    return hospitals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [hospitals, currentPage]);

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

      {/* Details List */}
      {showDetails && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-in slide-in-from-top-2 duration-300">
          <h3 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-widest">Revenue Breakdown</h3>
          <div className="space-y-3">
            {paginatedHospitals.length > 0 ? (
              paginatedHospitals.map((hospital, index) => (
                <div key={hospital._id || index} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl border border-gray-50">
                  <span className="text-sm font-bold text-gray-700">{hospital.hospital_name}</span>
                  <span className="text-sm font-black text-gray-900">${parseFloat(hospital.revenue || 0).toLocaleString()}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 italic">No hospital revenue data available.</p>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6 pt-6 border-t border-gray-100">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(1)} className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-20"><FiChevronsLeft /></button>
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-20"><FiChevronLeft /></button>
              <span className="text-xs font-black text-gray-400 uppercase w-20 text-center">{currentPage} of {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-20"><FiChevronRight /></button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)} className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-20"><FiChevronsRight /></button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}