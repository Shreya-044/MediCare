import { useState } from "react";
import {
  FiX,
  FiPlus,
  FiTrash2,
  FiDownload,
  FiSave,
} from "react-icons/fi";

export default function ReportModal({
  patient,
  onClose,
  onSave,
  viewData,
}) {
  const isView = !!viewData;

  const [title, setTitle] = useState(viewData?.title || "");

  const [doctorNotes, setDoctorNotes] = useState(
    viewData?.doctor_notes || ""
  );

  const [rows, setRows] = useState(
    viewData?.rows || [
      {
        label: "",
        value: "",
      },
    ]
  );

  const addRow = () => {
    setRows([
      ...rows,
      {
        label: "",
        value: "",
      },
    ]);
  };

  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const updateRow = (index, key, value) => {
    const copy = [...rows];
    copy[index][key] = value;
    setRows(copy);
  };

  const handleSubmit = () => {
    onSave({
      title,
      doctor_notes: doctorNotes,
      rows,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto relative">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-8 py-6 rounded-t-3xl flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-gray-900">
              {isView ? "Medical Report" : "Create Medical Report"}
            </h2>

            {!isView && patient && (
              <p className="text-sm text-gray-500 mt-1">
                Patient : <span className="font-bold">{patient.name}</span>
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition"
          >
            <FiX size={26} />
          </button>
        </div>

        <div className="p-8">

          {/* Report Title */}

          <div className="mb-6">
            <label className="block text-xs font-black uppercase text-gray-400 mb-2">
              Report Title
            </label>

            <input
              type="text"
              value={title}
              readOnly={isView}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Example : Blood Test Report"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-semibold outline-none focus:ring-2 focus:ring-[#0b645b]"
            />
          </div>

          {/* Doctor Notes */}

          <div className="mb-8">
            <label className="block text-xs font-black uppercase text-gray-400 mb-2">
              Doctor Notes
            </label>

            <textarea
              rows={4}
              value={doctorNotes}
              readOnly={isView}
              onChange={(e) => setDoctorNotes(e.target.value)}
              placeholder="General observations, diagnosis or advice..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-semibold outline-none resize-none focus:ring-2 focus:ring-[#0b645b]"
            />
          </div>

          {/* Report Rows */}

          <div className="mb-4 flex justify-between items-center">

            <label className="text-xs font-black uppercase text-gray-400">
              Report Details
            </label>

            {!isView && (
              <button
                onClick={addRow}
                className="flex items-center gap-2 text-[#0b645b] font-bold text-sm hover:underline"
              >
                <FiPlus />
                Add Row
              </button>
            )}
          </div>

          <div className="space-y-3">

            {rows.map((row, index) => (

              <div
                key={index}
                className="flex flex-col md:flex-row gap-3"
              >

                <input
                  type="text"
                  placeholder="Label"
                  readOnly={isView}
                  value={row.label}
                  onChange={(e) =>
                    updateRow(index, "label", e.target.value)
                  }
                  className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-semibold outline-none"
                />

                <input
                  type="text"
                  placeholder="Value"
                  readOnly={isView}
                  value={row.value}
                  onChange={(e) =>
                    updateRow(index, "value", e.target.value)
                  }
                  className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-semibold outline-none"
                />

                {!isView && (
                  <button
                    onClick={() => removeRow(index)}
                    className="px-4 rounded-xl bg-red-50 text-red-500 hover:bg-red-100"
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>

            ))}

          </div>

          {/* Buttons */}

          <div className="mt-10">

            {!isView ? (

              <button
                onClick={handleSubmit}
                className="w-full bg-[#0b645b] hover:bg-[#094d46] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition"
              >
                <FiSave />
                Save Report
              </button>

            ) : (

              <button
                className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition"
              >
                <FiDownload />
                Download PDF
              </button>

            )}

          </div>

        </div>
      </div>
    </div>
  );
}