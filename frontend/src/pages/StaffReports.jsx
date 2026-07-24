import { useState, useMemo } from "react";
import { 
  FiFileText, FiClipboard, FiDollarSign, FiPrinter, 
  FiChevronRight, FiChevronLeft, FiCheckCircle, FiInfo, FiCalendar, FiX 
} from "react-icons/fi";

export default function StaffReports() {
  // --- Calendar & Data State ---
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewDate, setViewDate] = useState(new Date()); // For calendar navigation

  const [completedPatients] = useState([
    { 
      id: 1, token: "A01", name: "Mukesh Jaswant", visitDate: new Date(),
      prescribedMedicines: [{ name: "Paracetamol 500mg (1 BD)", price: 300 }, { name: "Amoxicillin 250mg (1 TDS)", price: 150 }], 
      report: "Blood_Test_Report_A01.pdf"
    },
    { 
      id: 2, token: "B01", name: "Leela Jeswal", visitDate: new Date(),
      prescribedMedicines: [{ name: "Vitamin D3 (1 Daily)", price: 200 }], 
      report: "XRay_Chest_Report_B01.pdf"
    },
    { 
      id: 3, token: "C01", name: "Rahul Verma", visitDate: new Date(new Date().setDate(new Date().getDate() - 5)),
      prescribedMedicines: [{ name: "Cough Syrup (1 TDS)", price: 100 }], 
      report: "Flu_Report_C01.pdf"
    }
  ]);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [wantsMedicine, setWantsMedicine] = useState(false);
  const [showBill, setShowBill] = useState(false);

  // --- Logic: 7-Day Validity ---
  const filteredPatients = useMemo(() => {
    return completedPatients.filter(patient => {
      const visit = new Date(patient.visitDate);
      const expiry = new Date(visit);
      expiry.setDate(expiry.getDate() + 7);
      return selectedDate >= visit && selectedDate <= expiry;
    });
  }, [selectedDate, completedPatients]);

  // --- Financial Calculations ---
  const subtotal = selectedPatient?.prescribedMedicines.reduce((acc, med) => acc + med.price, 0) || 0;
  const gstAmount = subtotal * 0.03;
  const totalAmount = subtotal + gstAmount;

  // --- Calendar Helper Functions ---
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-10 py-10 animate-in fade-in">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-gray-900">Patient Records</h2>
          <p className="text-gray-500 font-medium">Valid for 7 days post-visit.</p>
        </div>
        <button 
          onClick={() => setShowCalendar(true)}
          className="flex items-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-2xl font-black text-sm hover:border-[#0b645b] transition"
        >
          <FiCalendar /> {selectedDate.toDateString()}
        </button>
      </div>

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white p-6 rounded-3xl w-full max-w-sm shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-lg">{viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
              <div className="flex gap-2">
                <button onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))} className="p-2 hover:bg-gray-100 rounded-full"><FiChevronLeft /></button>
                <button onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))} className="p-2 hover:bg-gray-100 rounded-full"><FiChevronRight /></button>
                <button onClick={() => setShowCalendar(false)} className="p-2 hover:bg-gray-100 rounded-full"><FiX /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-400 mb-2">
              {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <span key={d}>{d}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {[...Array(firstDayOfMonth).keys()].map(i => <div key={`empty-${i}`} />)}
              {[...Array(daysInMonth).keys()].map(i => {
                const day = i + 1;
                const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
                const isSelected = d.toDateString() === selectedDate.toDateString();
                const isToday = d.toDateString() === new Date().toDateString();
                return (
                  <button key={i} onClick={() => { setSelectedDate(d); setShowCalendar(false); setSelectedPatient(null); }} 
                    className={`p-2 rounded-xl text-sm font-bold ${isSelected ? 'bg-[#0b645b] text-white' : isToday ? 'bg-teal-50 text-[#0b645b]' : 'hover:bg-gray-100'}`}>
                    {day}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Patient List */}
        <div className="md:col-span-1 space-y-4">
          <h4 className="font-black text-sm text-gray-400 uppercase tracking-widest px-2">Records for {selectedDate.toLocaleDateString()}</h4>
          {filteredPatients.length === 0 ? (
            <p className="text-gray-400 text-sm p-4 font-bold bg-white rounded-2xl border border-dashed border-gray-200">No records found for this date.</p>
          ) : (
            filteredPatients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => { setSelectedPatient(patient); setShowBill(false); setWantsMedicine(false); }}
                className={`w-full p-5 rounded-2xl border text-left transition-all ${selectedPatient?.id === patient.id ? "bg-[#0b645b] text-white shadow-lg border-[#0b645b]" : "bg-white border-gray-100 hover:border-gray-200"}`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-black text-sm">{patient.name}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded ${selectedPatient?.id === patient.id ? "bg-white/20" : "bg-gray-100"}`}>{patient.token}</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Details Panel */}
        <div className="md:col-span-2">
          {selectedPatient ? (
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8 animate-in slide-in-from-right-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-4 text-[#0b645b]"><FiClipboard /> <h4 className="font-black text-sm uppercase">Prescription</h4></div>
                  <ul className="space-y-2">
                    {selectedPatient.prescribedMedicines.map((med, i) => (
                      <li key={i} className="text-sm font-bold text-gray-700 bg-white p-3 rounded-xl border border-gray-100 flex justify-between"><span>{med.name}</span> <span className="text-gray-400">₹{med.price}</span></li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-4 text-[#0b645b]"><FiFileText /> <h4 className="font-black text-sm uppercase">Hospital Report</h4></div>
                  <button className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-[#0b645b] transition group">
                    <span className="text-sm font-bold text-gray-600 truncate">{selectedPatient.report}</span>
                    <FiChevronRight className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Pharmacy Billing */}
              <div className="p-6 bg-white border border-gray-200 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div><h4 className="font-black text-gray-900">Pharmacy Billing</h4></div>
                  <button onClick={() => setWantsMedicine(!wantsMedicine)} className={`w-14 h-8 rounded-full transition relative ${wantsMedicine ? "bg-[#0b645b]" : "bg-gray-200"}`}>
                    <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${wantsMedicine ? "left-7" : "left-1"}`} />
                  </button>
                </div>
                {wantsMedicine && (
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 animate-in fade-in">
                    {!showBill ? (
                      <button onClick={() => setShowBill(true)} className="w-full bg-[#0b645b] text-white p-4 rounded-xl font-bold hover:bg-[#084e46] transition">Generate Medicine Bill</button>
                    ) : (
                      <div className="space-y-4">
                        <h4 className="font-black text-gray-900 border-b border-gray-200 pb-2">Final Invoice</h4>
                        {selectedPatient.prescribedMedicines.map((med, i) => (
                           <div key={i} className="flex justify-between text-sm font-bold text-gray-600"><span>{med.name}</span><span>₹{med.price}</span></div>
                        ))}
                        <div className="border-t border-gray-200 pt-4 space-y-2">
                           <div className="flex justify-between text-xs font-bold text-gray-500"><span>Subtotal</span><span>₹{subtotal}</span></div>
                           <div className="flex justify-between text-xs font-bold text-gray-500"><span>GST (3%)</span><span>₹{gstAmount.toFixed(2)}</span></div>
                           <div className="flex justify-between items-end pt-2">
                             <FiPrinter className="text-gray-400 cursor-pointer hover:text-gray-600" size={20} />
                             <div className="border-t border-gray-200 pt-4 space-y-2 text-right">
                               <p className="text-[10px] font-black text-gray-400 uppercase">Total Due</p>
                               <p className="text-3xl font-black text-[#0b645b]">₹{totalAmount.toFixed(2)}</p>
                             </div>
                           </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl p-10">
              <p className="text-gray-400 font-bold flex items-center gap-2"><FiInfo /> Select a patient to view report and billing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}