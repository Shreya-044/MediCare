import { useState, useRef, useEffect } from "react";
import { searchHospitals } from "../services/hospitalService";
import { QRCodeCanvas } from "qrcode.react";

export default function Home() {
  const [search, setSearch] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const searchRef = useRef(null);
  const faqs = [
    { q: "How does Medicare work?", a: "Medicare connects you to qualified doctors through an easy-to-use platform." },
    { q: "How do I choose an online doctor specialist?", a: "Use the search bar to filter by location or specialty." },
    { q: "Is it OK to consult a doctor online?", a: "Yes, online consultations are safe for non-emergency conditions." },
    { q: "What types of doctors can I consult with on Medicare?", a: "We offer consultations across 12+ medical specialties." },
    { q: "Will I get a refund if I cancel an online consultation?", a: "Yes, refunds are processed according to our policy." },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (value) => {
    setSearch(value);
    setSelectedHospital(null);
    if (!value.trim()) {
      setHospitals([]);
      setShowDropdown(false);
      return;
    }
    try {
      setLoading(true);
      setShowDropdown(true);
      const response = await searchHospitals(value);
      if (response.success) setHospitals(response.data);
    } catch (error) { console.log(error); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 -mt-6">
      <div className="max-w-7xl mx-auto px-10">
        
        {/* Search Bar */}
        <div className="py-12 relative" ref={searchRef}>
          <div className="max-w-3xl mx-auto bg-white rounded-full p-4 shadow-sm border border-gray-200 flex items-center relative z-20">
            <span className="pl-4 text-xl">🔍</span>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full h-8 px-4 outline-none text-base text-gray-700"
            />
          </div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute left-0 right-0 mx-auto max-w-3xl mt-3 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-30">
              {loading ? (
                <div className="p-4 text-center text-gray-400 text-sm">Searching...</div>
              ) : hospitals.length > 0 ? (
                <div className="max-h-80 overflow-y-auto">
                  {hospitals.map((h) => (
                    <button
                      key={h._id}
                      onClick={() => { 
                        setSelectedHospital(h); 
                        setSearch(h.hospital_name); 
                        setShowDropdown(false); 
                      }}
                      className="w-full text-left px-6 py-4 hover:bg-teal-50 border-b border-gray-50 last:border-0 transition-all duration-200 flex flex-col gap-0.5"
                    >
                      <p className="font-semibold text-gray-800 text-sm">{h.hospital_name}</p>
                      <p className="text-[11px] text-gray-500 flex items-center gap-1 font-medium">
                        <span className="text-red-400">📍</span> {h.address}, {h.city}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-400 text-sm">No hospitals found.</div>
              )}
            </div>
          )}
        </div>

        {/* Selected Hospital Detailed Card */}
        {selectedHospital && (
          <div className="max-w-5xl mx-auto bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-6 mb-16">
            <img 
              src="/hospital-placeholder.jpg" 
              alt="Hospital" 
              className="w-60 h-32 rounded-xl object-cover shrink-0" 
            />
            
            {/* Main Information */}
            <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-gray-900">{selectedHospital.hospital_name}</h2>
              <p className="text-gray-500 flex items-center gap-1 mt-1 text-sm font-medium">
                <span className="text-rose-400 text-xs">📍</span> {selectedHospital.address}, {selectedHospital.city}
              </p>
              
              {/* Contact Details */}
              <div className="flex items-center gap-4 mt-2 text-xs font-bold text-[#0b645b]">
                <p className="flex items-center gap-1">
                  <span className="text-teal-600">📞</span> {selectedHospital.phone}
                </p>
                <p className="flex items-center gap-1">
                  <span className="text-red-400">🚨</span> Emergency: {selectedHospital.emergency_phone}
                </p>
              </div>
            </div>

            {/* QR Section */}
            <div className="text-center flex flex-col items-center shrink-0 pr-2">
              <div className="flex flex-col items-center">
                <div className="w-26 h-26 bg-white border border-gray-200 rounded-lg mb-1 flex items-center justify-center p-1">
                  <QRCodeCanvas
                    value={`${window.location.origin}/appointment/${selectedHospital._id}`} 
                    size={90}
                    level={"H"}
                    includeMargin={true}
                  />
                </div>
                <p className="text-[9px] font-black text-[#0b645b] uppercase tracking-wider">
                  Scan to book
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="bg-[#0b645b] rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between text-white shadow-xl mb-16">
          <div className="max-w-xl">
            <h2 className="text-3xl font-black mb-3">MediCare provides the best<br />healthcare solutions</h2>
            <p className="text-sm opacity-90">Everything you need to know in minutes</p>
          </div>
          <div className="bg-white/10 px-8 py-6 rounded-2xl flex items-center gap-4">
            <div className="text-3xl">🩺</div>
            <p className="font-bold text-sm leading-tight">Revolutionizing Healthcare<br />Delivery</p>
          </div>
        </section>

        {/* Why Choose */}
        <section className="my-16">
          <h2 className="text-center text-2xl font-black text-gray-900 mb-10">WHY CHOOSE MEDICARE?</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { title: "Convenient Access", desc: "INSTANT MEDICAL CARE", icon: "📱", color: "bg-pink-50" },
              { title: "Expert Specialists", desc: "TOP DOCTORS ONLINE", icon: "👨‍⚕️", color: "bg-cyan-50" },
              { title: "Time & Cost Savings", desc: "EFFICIENT CONSULTATIONS", icon: "💰", color: "bg-orange-50" },
              { title: "Personalized Treatment", desc: "TAILORED HEALTHCARE", icon: "🧩", color: "bg-green-50" },
              { title: "Secure & Private", desc: "SAFE TELEMEDICINE", icon: "🛡️", color: "bg-indigo-50" },
            ].map((item) => (
              <div key={item.title} className={`${item.color} p-8 rounded-4xl text-center flex flex-col items-center`}>
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl mb-6 shadow-sm">{item.icon}</div>
                <h3 className="font-black text-sm text-gray-900">{item.title}</h3>
                <p className="text-[10px] font-bold text-gray-500 mt-2 tracking-widest uppercase">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-6">FAQ's</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={`w-full p-5 flex justify-between font-bold text-sm transition-colors ${openFaq === i ? "bg-[#14b8a6] text-white" : "text-gray-900"}`}
                >
                  {faq.q} <span>{openFaq === i ? "-" : "+"}</span>
                </button>
                {openFaq === i && <div className="p-5 text-sm bg-[#14b8a6] text-white -mt-1">{faq.a}</div>}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}