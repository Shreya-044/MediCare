import React, { useState } from 'react';
import { FiFileText, FiDownload, FiUser, FiCalendar, FiActivity, FiEye, FiXCircle } from 'react-icons/fi';

export default function PatientReport() {
  const [reports] = useState([
    {
      id: "RPT-2026-001",
      title: "Blood Analysis Report",
      doctor: "Dr. Smith",
      hospital: "City General Hospital",
      date: "18-07-2026",
      testDate: "17-07-2026",
      receivedDate: "18-07-2026",
      type: "Pathology",
      fileSize: "1.2 MB",
      summary: "Hemoglobin, WBC, and Platelets are within the specified reference ranges. No immediate clinical concerns noted based on these markers.",
      results: [
        { name: "Hemoglobin", result: "14.5", ref: "13-17", unit: "g/dL" },
        { name: "WBC", result: "7.2", ref: "4-11", unit: "k/uL" },
        { name: "Platelets", result: "250", ref: "150-450", unit: "k/uL" }
      ]
    },
    {
      id: "RPT-2026-002",
      title: "Chest X-Ray Results",
      doctor: "Dr. Jones",
      hospital: "City General Hospital",
      date: "10-07-2026",
      testDate: "09-07-2026",
      receivedDate: "10-07-2026",
      type: "Radiology",
      fileSize: "4.5 MB",
      summary: "Normal cardiomediastinal silhouette and hilar contours. No suspicious pulmonary opacities or pleural effusions observed.",
      results: [] 
    }
  ]);
  
  const [previewReport, setPreviewReport] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 md:py-12 animate-in fade-in">
      <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-6 md:mb-8">Medical Reports</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {reports.map((report) => (
          <div key={report.id} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow-md transition-all gap-4">
            <div className="flex gap-4 md:gap-6 items-start sm:items-center">
              <div className="p-3 md:p-4 bg-blue-50 text-blue-600 rounded-2xl">
                <FiFileText size={24} />
              </div>
              <div>
                <h3 className="font-black text-sm md:text-base text-gray-900">{report.title}</h3>
                <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 md:mb-3">{report.type} • {report.id}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[9px] md:text-[10px] font-bold text-gray-500">
                  <span className="flex items-center gap-1"><FiUser size={12}/> {report.doctor}</span>
                  <span className="flex items-center gap-1"><FiCalendar size={12}/> {report.date}</span>
                  <span className="flex items-center gap-1"><FiActivity size={12}/> {report.hospital}</span>
                  <span className="flex items-center gap-1 italic">{report.fileSize}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <button onClick={() => setPreviewReport(report)} className="p-3 bg-gray-50 hover:bg-gray-200 rounded-xl transition">
                <FiEye size={18} />
              </button>
              <button className="p-3 bg-gray-50 hover:bg-[#0b645b] hover:text-white rounded-xl transition">
                <FiDownload size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {previewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 md:p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setPreviewReport(null)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"><FiXCircle size={20}/></button>
            
            <div className="border-b pb-4 mb-4">
              <h1 className="text-lg md:text-xl font-black text-[#0b645b] uppercase">MediCare Pathology Lab</h1>
              <p className="text-[9px] md:text-[10px] font-bold text-gray-400">123 Health Ave, New Delhi • Contact: 011-23456789</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[9px] md:text-[10px] mb-6 bg-gray-50 p-4 rounded-xl">
              <p className="font-bold">Patient: John Doe</p>
              <p className="font-bold">Referred By: {previewReport.doctor}</p>
              <p className="font-bold">Sample Collected: {previewReport.testDate}</p>
              <p className="font-bold">Reported: {previewReport.receivedDate}</p>
            </div>

            <h3 className="font-black text-xs md:text-sm mb-2 uppercase">{previewReport.title}</h3>
            
            {previewReport.results.length > 0 && (
              <table className="w-full text-[10px] md:text-xs mb-6">
                <thead className="text-gray-400 uppercase text-[9px] border-b">
                  <tr><th className="py-2 text-left">Investigation</th><th className="py-2 text-center">Result</th><th className="py-2 text-center">Ref. Range</th></tr>
                </thead>
                <tbody className="font-bold">
                  {previewReport.results.map((r, i) => (
                    <tr key={i} className="border-b"><td className="py-3">{r.name}</td><td className="py-3 text-center">{r.result} {r.unit}</td><td className="py-3 text-center">{r.ref}</td></tr>
                  ))}
                </tbody>
              </table>
            )}
            
            <div className="mb-4">
              <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Clinical Summary:</p>
              <p className="text-[10px] font-medium text-gray-600 leading-relaxed italic">{previewReport.summary}</p>
            </div>

            <p className="text-[9px] md:text-[10px] italic text-center font-bold text-gray-400 mb-4">****End of Report****</p>
            
            <div className="flex justify-between pt-6 border-t text-[9px] md:text-[10px] font-bold text-gray-400">
              <p className="text-center">Lab Technician<br/>(DMLT)</p>
              <p className="text-center">Pathologist<br/>(MD, Path)</p>
            </div>
            
            <button className="mt-6 w-full py-3 bg-[#0b645b] text-white rounded-xl font-black text-xs">DOWNLOAD PDF</button>
          </div>
        </div>
      )}
    </div>
  );
}