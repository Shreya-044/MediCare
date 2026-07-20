import { FiArrowLeft, FiClock, FiCheckCircle, FiUser } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LiveQueue() {
  const navigate = useNavigate();
  const location = useLocation();
  const appointment = location.state?.appointment;
  const queueList = [
    { id: 1, name: "Patient 1", token: 3, status: "CURRENT" },
    { id: 2, name: "Patient 2", token: 4, status: "NEXT" },
    { id: 3, name: "Patient 3", token: 5, status: "1 ahead of you" },
    { id: 4, name: "Patient 4", token: 6, status: "2 ahead of you" },
    { id: 5, name: "Patient 5", token: 7, status: "3 ahead of you" },
  ];

  const isCashPayment = appointment?.payment_method === 'cash';
  const getWaitTime = (currentIndex) => {
    const nextIndex = queueList.findIndex(p => p.status === "NEXT");
    if (currentIndex < nextIndex) return null;
    const diff = (currentIndex - nextIndex + 1) * 15;
    return `${diff}m`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-sm font-bold text-gray-500 mb-6 hover:text-gray-800"
      >
        <FiArrowLeft className="mr-2" /> Back to Appointments
      </button>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-6">
        <h2 className="text-xl font-black">{appointment?.doctor_name || "Doctor Name"}</h2>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{appointment?.department || "Department"}</p>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-lg">
        {isCashPayment ? (
          <div className="py-10 text-center">
            <FiCheckCircle size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-black text-gray-700">Appointment Confirmed</h3>
            <p className="text-sm font-bold text-gray-500 mt-2">Live queue tracking is only available for online payments.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {queueList.map((patient, index) => {
              const isCurrent = patient.status === "CURRENT";
              const isUser = patient.token === (appointment?.token_number || 7);
              const waitTime = getWaitTime(index);

              return (
                <div 
                  key={patient.id} 
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    isCurrent 
                      ? "bg-[#0b645b] text-white" 
                      : isUser 
                        ? "bg-[#f0f9f8] border-[#0b645b] border-2" 
                        : "bg-gray-50 border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${isCurrent ? "bg-white/20" : "bg-white"}`}>
                      <FiUser size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-black ${isCurrent ? "text-white" : "text-gray-900"}`}>
                          {patient.name}
                        </p>
                        {isUser && (
                          <span className="text-[9px] font-black bg-[#0b645b] text-white px-2 py-0.5 rounded-full uppercase">YOU</span>
                        )}
                      </div>
                      <p className={`text-[10px] font-bold ${isCurrent ? "text-white/80" : "text-gray-400"}`}>
                        TOKEN #{patient.token}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-[10px] font-black uppercase ${isCurrent ? "text-white" : "text-[#0b645b]"}`}>
                      {patient.status}
                    </p>
                    {waitTime && (
                      <p className="text-[10px] font-bold text-gray-400 mt-1 flex items-center justify-end gap-1">
                        <FiClock size={10} /> {waitTime}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}