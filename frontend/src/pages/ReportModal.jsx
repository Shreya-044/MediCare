import { useState } from "react";
import { FiX, FiPlus, FiTrash2, FiDownload } from "react-icons/fi";

export default function ReportModal({ patient, onClose, onSave, viewData }) {
  const [reportType, setReportType] = useState(viewData?.reportType || "Blood Analysis");
  const [investigations, setInvestigations] = useState(viewData?.investigations || [{ name: "", result: "", range: "" }]);
  const [summary, setSummary] = useState(viewData?.summary || "");

  const reportTypes = ["Blood Analysis", "Chest X-Ray", "Urinalysis", "Lipid Profile", "Thyroid Function Test"];

  const addRow = () => setInvestigations([...investigations, { name: "", result: "", range: "" }]);
  const removeRow = (index) => setInvestigations(investigations.filter((_, i) => i !== index));
  const updateRow = (index, field, value) => {
    const updated = [...investigations];
    updated[index][field] = value;
    setInvestigations(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-red-500"><FiX size={24}/></button>
        
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-6">{viewData ? "View Medical Report" : "Generate Medical Report"}</h2>
        
        <div className="mb-6">
          <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Report Type</label>
          <select disabled={!!viewData} className="w-full mt-1 p-3 bg-gray-50 rounded-xl font-bold text-sm outline-none border border-gray-100" value={reportType} onChange={(e) => setReportType(e.target.value)}>
            {reportTypes.map(type => <option key={type}>{type}</option>)}
          </select>
        </div>

        <div className="space-y-3 mb-6">
          <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Investigation Details</label>
          {investigations.map((inv, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-2">
              <input disabled={!!viewData} placeholder="Test Name" className="flex-1 p-3 bg-gray-50 rounded-xl text-sm font-bold" value={inv.name} onChange={(e) => updateRow(index, 'name', e.target.value)} />
              <div className="flex gap-2">
                <input disabled={!!viewData} placeholder="Result" className="w-24 p-3 bg-gray-50 rounded-xl text-sm font-bold" value={inv.result} onChange={(e) => updateRow(index, 'result', e.target.value)} />
                <input disabled={!!viewData} placeholder="Range" className="w-24 p-3 bg-gray-50 rounded-xl text-sm font-bold" value={inv.range} onChange={(e) => updateRow(index, 'range', e.target.value)} />
                {!viewData && <button onClick={() => removeRow(index)} className="p-3 text-red-500 bg-red-50 rounded-xl"><FiTrash2/></button>}
              </div>
            </div>
          ))}
          {!viewData && <button onClick={addRow} className="text-xs font-black text-[#0b645b] flex items-center gap-2 hover:underline py-2"><FiPlus/> Add Row</button>}
        </div>

        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Clinical Summary</label>
          <textarea disabled={!!viewData} className="w-full p-4 bg-gray-50 rounded-xl text-sm font-bold mt-1 outline-none" rows="3" value={summary} onChange={(e) => setSummary(e.target.value)} />
        </div>

        {!viewData ? (
          <button onClick={() => onSave({ reportType, investigations, summary })} className="w-full mt-8 py-4 bg-[#0b645b] text-white rounded-2xl font-black text-sm hover:bg-[#084e46]">GENERATE & UPLOAD REPORT</button>
        ) : (
          <button className="w-full mt-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2"><FiDownload/> DOWNLOAD PDF</button>
        )}
      </div>
    </div>
  );
}