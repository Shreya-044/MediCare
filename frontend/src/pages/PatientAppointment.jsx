import React, { useState, useEffect } from 'react';
import api from "../services/api";
import { FiCalendar, FiClock, FiMapPin, FiMoreVertical, FiDownload, FiXCircle, FiUsers, FiActivity } from 'react-icons/fi';

export default function PatientAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [showInvoice, setShowInvoice] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
console.log(user);
console.log(user._id);

  useEffect(() => {

    fetchAppointments();

  }, []);

  const fetchAppointments = async () => {

    try {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const response = await api.get(
        `/patient/${user._id}/appointments`
      );

      console.log(response.data);

      setAppointments(response.data.data);

    } catch (err) {

      console.log(err);

    }

  };

  return (
    <div className="max-w-7xl mx-auto px-10 py-12">
      <h2 className="text-2xl font-black text-gray-900 mb-8">My Appointments</h2>
      {appointments.length === 0 && (
        <div className="bg-white p-12 rounded-3xl text-center shadow-sm">
          <h3 className="text-xl font-bold text-gray-700">
            No appointments found
          </h3>

          <p className="text-gray-500 mt-2">
            Book your first appointment to see it here.
          </p>
        </div>
      )}

      {appointments.map((appt) => (
        <div key={appt._id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-6 flex justify-between items-center relative">
          <div className="flex gap-8">
            <div>
              <h3 className="text-lg font-black">{appt.doctor_name}</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{appt.department}</p>
              <div className="flex flex-col gap-2 mt-4 text-xs font-bold text-gray-600">
                <span className="flex items-center gap-2"><FiMapPin />{appt.hospital_name}</span>
                <span className="flex items-center gap-2"><FiCalendar />{appt.appointment_date}</span>
                <span className="flex items-center gap-2"><FiClock />{appt.appointment_time}</span>
              </div>
            </div>

            <div className="border-l border-gray-100 pl-8 flex flex-col gap-2 justify-center">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0b645b]">
                <FiUsers />
                <span>{appt.patientsAhead ?? "N/A"} Patients ahead of you</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-orange-500">
                <FiActivity />
                <span>Expected wait: {appt.expectedWait ?? "N/A"}</span>
              </div>
            </div>
          </div>

          <button onClick={() => setMenuOpen(menuOpen === appt._id ? null : appt._id)} className="p-2 hover:bg-gray-100 rounded-full">
            <FiMoreVertical />
          </button>
          {menuOpen === appt._id && (
            <div className="absolute right-10 top-16 bg-white shadow-xl rounded-2xl border border-gray-100 p-2 z-10 w-48">
              <button onClick={() => setShowInvoice(appt)} className="flex items-center w-full px-4 py-3 text-xs font-bold hover:bg-gray-50 rounded-xl"><FiDownload className="mr-2" /> View Invoice</button>
              <button onClick={() => alert("Cancellation request submitted. Refund will be processed in 5-7 working days.")} className="flex items-center w-full px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl"><FiXCircle className="mr-2" /> Cancel</button>
            </div>
          )}
        </div>
      ))}

      {/* Realistic Invoice Modal */}
      {showInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-10 shadow-2xl relative">
            <button onClick={() => setShowInvoice(null)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600"><FiXCircle size={20} /></button>

            <h2 className="text-xl font-black text-center mb-2">Medical Clinic Invoice</h2>
            <p className="text-[10px] text-center text-gray-400 font-bold mb-8 uppercase tracking-widest">
              {showInvoice.hospital_name} — {showInvoice.hospital_address}
            </p>

            <div className="grid grid-cols-2 gap-8 mb-8 border-t border-b py-6">
              <div className="space-y-2">
                <p className="text-xs font-black text-gray-800">Invoice Details:</p>
                <p className="text-[10px] font-bold text-gray-500">
                  • Invoice Number: {showInvoice.invoice_number || showInvoice._id}
                </p>
                <p className="text-[10px] font-bold text-gray-500">
                  • Date of Issue: {new Date(showInvoice.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-black text-gray-800">Bill To:</p>
                <p className="text-[10px] font-bold text-gray-500">
                  • Patient Name: {showInvoice.patient_name}
                </p>
                <p className="text-[10px] font-bold text-gray-500">
                  • Contact Number: {showInvoice.phone}
                </p>
              </div>
            </div>

            <table className="w-full text-left text-xs mb-8">
              <thead className="text-gray-400 uppercase"><tr><th className="pb-4">Description</th><th className="pb-4 text-right">Amount</th></tr></thead>
              <tbody className="font-bold border-t border-gray-100">
                <tr className="border-b border-gray-100"><td className="py-4">Consultation Fee</td><td className="py-4 text-right">₹{showInvoice.consultation_fee.toFixed(2)}</td></tr>
                <tr className="border-b border-gray-100"><td className="py-4">Platform Fee</td><td className="py-4 text-right">₹10.00</td></tr>
                <tr className="border-b border-gray-100"><td className="py-4">GST (5%)</td><td className="py-4 text-right">₹{(showInvoice.consultation_fee * 0.05).toFixed(2)}</td></tr>
              </tbody>
            </table>

            <div className="flex justify-between font-black text-sm mb-8"><span>Total Amount Due:</span> <span>₹{showInvoice.total_amount.toFixed(2)}</span></div>
            <button className="w-full py-4 bg-[#0b645b] text-white rounded-2xl font-black text-xs">DOWNLOAD PDF</button>
          </div>
        </div>
      )}
    </div>
  );
}