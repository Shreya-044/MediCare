import { useState } from "react";
import { FiX, FiPlus, FiTrash2, FiMinus, FiEdit3, FiCheck, FiClock } from "react-icons/fi";

export default function PrescriptionModal({ patient, onClose, onSave }) {
  const [meds, setMeds] = useState([{ name: "", mg: "", qty: 1, notes: "", isLocked: false }]);

  const addRow = () => setMeds([...meds, { name: "", mg: "", qty: 1, notes: "", isLocked: false }]);
  const removeRow = (index) => setMeds(meds.filter((_, i) => i !== index));

  const updateMed = (index, field, value) => {
    const updated = [...meds];
    updated[index][field] = value;
    setMeds(updated);
  };

  const toggleLock = (index) => {
    const updated = [...meds];
    updated[index].isLocked = !updated[index].isLocked;
    setMeds(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-red-500"><FiX size={24}/></button>
        
        <h2 className="text-2xl font-black text-gray-900 mb-1">New Prescription</h2>
        <div className="text-[10px] font-black text-gray-400 uppercase mb-8 tracking-widest bg-gray-50 inline-block px-3 py-1 rounded-full">
          Patient: {patient.name} • {new Date().toLocaleDateString()}
        </div>

        <div className="space-y-4 mb-8 max-h-[50vh] overflow-y-auto pr-2">
          {meds.map((med, index) => (
            <div key={index} className={`p-4 rounded-2xl border transition-all ${med.isLocked ? "bg-gray-50 border-gray-100" : "bg-white border-teal-100 shadow-sm"}`}>
              <div className="grid grid-cols-12 gap-3 items-start">
                {/* Main Inputs */}
                <div className="col-span-6 space-y-2">
                  <input disabled={med.isLocked} placeholder="Medicine Name" className="w-full p-3 rounded-xl text-sm font-bold bg-gray-50 outline-none" value={med.name} onChange={(e) => updateMed(index, 'name', e.target.value)} />
                  <input disabled={med.isLocked} placeholder="e.g. 1-0-1 After Food" className="w-full p-3 rounded-xl text-xs font-bold bg-gray-50 outline-none" value={med.notes} onChange={(e) => updateMed(index, 'notes', e.target.value)} />
                </div>
                
                <div className="col-span-3 flex flex-col gap-2">
                  <div className="flex items-center bg-gray-50 rounded-xl overflow-hidden">
                    <input disabled={med.isLocked} type="number" placeholder="0" className="w-full p-3 text-sm font-bold bg-transparent outline-none" value={med.mg} onChange={(e) => updateMed(index, 'mg', e.target.value)} />
                    <span className="text-[10px] font-black text-gray-400 pr-3 uppercase">mg</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl px-2 h-[48px]">
                    <button disabled={med.isLocked} onClick={() => updateMed(index, 'qty', Math.max(1, med.qty - 1))} className="p-2"><FiMinus size={12}/></button>
                    <span className="text-sm font-black">{med.qty}</span>
                    <button disabled={med.isLocked} onClick={() => updateMed(index, 'qty', med.qty + 1)} className="p-2"><FiPlus size={12}/></button>
                  </div>
                </div>

                {/* Actions */}
                <div className="col-span-3 flex flex-col gap-2 h-full">
                  <button onClick={() => toggleLock(index)} className={`p-3 rounded-xl flex justify-center ${med.isLocked ? "bg-teal-100 text-teal-700" : "bg-gray-100 text-gray-600"}`}>
                    {med.isLocked ? <FiEdit3 size={18}/> : <FiCheck size={18}/>}
                  </button>
                  <button onClick={() => removeRow(index)} className="p-3 rounded-xl bg-red-50 text-red-500 flex justify-center"><FiTrash2 size={18}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={addRow} className="flex items-center gap-2 text-xs font-black text-[#0b645b] mb-8 hover:underline"><FiPlus /> Add Another Medicine</button>

        <button onClick={() => onSave(meds)} className="w-full py-4 bg-[#0b645b] text-white rounded-2xl font-black text-sm hover:bg-[#084e46]">SAVE & SEND PRESCRIPTION</button>
      </div>
    </div>
  );
}