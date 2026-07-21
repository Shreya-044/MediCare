import { useState, useMemo, useEffect } from "react";
import { 
  FiChevronDown, FiChevronUp, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight,
  FiMapPin, FiPhone, FiUser, FiBriefcase
} from "react-icons/fi";

export default function RevenueView({ hospitals = [], fetchHospitals }) {
  const [showDetails, setShowDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  // Responsive pagination: 3 items on small screens, 4 on larger
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 640 ? 3 : 4);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (fetchHospitals) {
      fetchHospitals();
    }
  }, [fetchHospitals]);

  const totalRevenue = hospitals.reduce((sum, h) => sum + (parseFloat(h.revenue || 0)), 0);
  const totalPages = Math.ceil(hospitals.length / itemsPerPage) || 1;
  
  const paginatedHospitals = useMemo(() => {
    return hospitals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [hospitals, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div 
        onClick={() => setShowDetails(!showDetails)}
        className="cursor-pointer p-6 bg-green-50 rounded-2xl border border-green-100 flex justify-between items-center transition-all hover:bg-green-100"
      >
        <div>
          <p className="text-xs font-black text-green-600 uppercase tracking-widest">Total Revenue</p>
          <p className="text-2xl font-black text-green-900">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="text-green-600">
          {showDetails ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
        </div>
      </div>

      {/* Details List */}
      {showDetails && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm animate-in slide-in-from-top-4 duration-500">
          <h3 className="text-sm font-black text-gray-900 mb-6 uppercase tracking-widest">Revenue Breakdown</h3>
          <div className="space-y-4">
            {paginatedHospitals.length > 0 ? (
              paginatedHospitals.map((hospital, index) => (
                <div key={hospital._id || index} className="p-4 bg-white border border-gray-100 shadow-sm rounded-2xl hover:border-green-200 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-black text-gray-900">{hospital.hospital_name}</span>
                    <span className="text-sm font-black text-green-700 bg-green-50 px-3 py-1 rounded-full">$0</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] bg-gray-50 p-3 rounded-xl text-gray-600 font-bold">
                    <div className="flex items-center gap-2"><FiMapPin className="text-green-600" /> {hospital.city || "N/A"}, {hospital.state || "N/A"}</div>
                    <div className="flex items-center gap-2"><FiPhone className="text-green-600" /> {hospital.phone || "No phone"}</div>
                    <div className="flex items-center gap-2"><FiBriefcase className="text-green-600" /> {hospital.email || "No email"}</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 italic text-center py-10">No hospital data available.</p>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-8 mt-6 border-t border-gray-100">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(1)} className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-20"><FiChevronsLeft /></button>
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-20"><FiChevronLeft /></button>
              <span className="text-[10px] font-black text-gray-400 uppercase w-16 text-center">{currentPage} of {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-20"><FiChevronRight /></button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)} className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-20"><FiChevronsRight /></button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}