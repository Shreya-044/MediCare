import Home from "./Home";

export default function Dashboard({ activeTab }) {
  return (
    <div className="mt-6">
      {activeTab === "Home" && <Home />}
      {activeTab === "My Appointments" && <div className="text-center py-20 font-bold text-gray-400">No appointments scheduled.</div>}
      {activeTab === "My Reports" && <div className="text-center py-20 font-bold text-gray-400">No reports found.</div>}
    </div>
  );
}