import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchHospitals } from "../services/hospitalService";
import { QRCodeCanvas } from "qrcode.react";

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);

  const searchRef = useRef(null);
  const topRef = useRef(null);

  const specialties = [
    {
      name: "General Practitioner",
      icon: "🩺",
      image: "/general_practitioner.jpg",
    },
    { name: "Dental", icon: "🦷", image: "/dental.jpg" },
    { name: "Orthopedics", icon: "🦴", image: "/orthopedics.jpg" },
    { name: "Pediatrics", icon: "👶", image: "/pediatrics.jpg" },
    {
      name: "Obstetrics Gynecology",
      icon: "👩‍🍼",
      image: "/obstetrics_gynecology.jpg",
    },
    { name: "Cardiology", icon: "❤️", image: "/cardiology.jpg" },
    { name: "Psychology", icon: "🧠", image: "/psychology.jpg" },
    { name: "Oncology", icon: "🔬", image: "/oncology.jpg" },
    { name: "ENT", icon: "👂", image: "/ENT.jpg" },
    { name: "Neurology", icon: "⚡", image: "/neurology.jpg" },
    { name: "Physiotherapy", icon: "🏃", image: "/physiotherapy.jpg" },
    { name: "Radiology", icon: "☢️", image: "/radiology.jpg" },
  ];

  const faqs = [
    {
      q: "How does Medicare work?",
      a: "Medicare connects you to qualified doctors through an easy-to-use platform.",
    },
    {
      q: "How do I choose an online doctor specialist?",
      a: "Use the search bar to filter by location or specialty.",
    },
    {
      q: "Is it OK to consult a doctor online?",
      a: "Yes, online consultations are safe for non-emergency conditions.",
    },
    {
      q: "What types of doctors can I consult with on Medicare?",
      a: "We offer consultations across 12+ medical specialties.",
    },
    {
      q: "Will I get a refund if I cancel an online consultation?",
      a: "Yes, refunds are processed according to our policy.",
    },
  ];

  const bookingSteps = [
    {
      icon: "👤",
      title: "Create an Account",
      desc: "Sign up and create your profile with the details needed for appointment booking.",
    },
    {
      icon: "🔍",
      title: "Search for a Hospital",
      desc: "Use search to find hospitals by city, state, or name.",
    },
    {
      icon: "🏥",
      title: "Select a Facility",
      desc: "Review hospital services, contact details, and facilities before choosing.",
    },
    {
      icon: "📅",
      title: "Schedule an Appointment",
      desc: "Book your appointment online for an in-person or virtual consultation.",
    },
  ];

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20" ref={topRef}>
      <div className="max-w-7xl mx-auto px-4 md:px-10 space-y-24 pt-16">
        {/* Search Section */}
        <section className="relative" ref={searchRef}>
          <div className="max-w-3xl mx-auto bg-white rounded-full p-3 md:p-4 shadow-sm border border-gray-200 flex items-center relative z-20">
            <span className="pl-4 text-xl">🔍</span>
            <input
              type="text"
              placeholder="Search for hospitals..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full h-8 px-4 outline-none text-base text-gray-700"
            />
          </div>

          {showDropdown && (
            <div className="absolute left-0 right-0 mx-auto max-w-3xl mt-3 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-30">
              {loading ? (
                <div className="p-4 text-center text-gray-400 text-sm">
                  Searching...
                </div>
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
                      <p className="font-semibold text-gray-800 text-sm">
                        {h.hospital_name}
                      </p>
                      <p className="text-[11px] text-gray-500 flex items-center gap-1 font-medium">
                        <span className="text-red-400">📍</span> {h.address},{" "}
                        {h.city}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-400 text-sm">
                  No hospitals found.
                </div>
              )}
            </div>
          )}
        </section>

        {/* Selected Hospital Card */}
        {selectedHospital && (
          <section className="max-w-5xl mx-auto bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6">
            <img
              src="/hospital-placeholder.jpg"
              alt="Hospital"
              className="w-full md:w-60 h-40 md:h-32 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 flex flex-col justify-center text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                {selectedHospital.hospital_name}
              </h2>
              <p className="text-gray-500 flex items-center justify-center md:justify-start gap-1 mt-1 text-sm font-medium">
                <span className="text-rose-400 text-xs">📍</span>{" "}
                {selectedHospital.address}, {selectedHospital.city}
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-4 mt-2 text-xs font-bold text-[#0b645b]">
                <p className="flex items-center gap-1">
                  <span className="text-teal-600">📞</span>{" "}
                  {selectedHospital.phone}
                </p>
                <p className="flex items-center gap-1">
                  <span className="text-red-400">🚨</span> Emergency:{" "}
                  {selectedHospital.emergency_phone}
                </p>
              </div>
            </div>
            <div className="text-center flex flex-col items-center shrink-0 pr-0 md:pr-2 pb-4 md:pb-0">
              <div className="w-24 h-24 bg-white border border-gray-200 rounded-lg mb-1 flex items-center justify-center p-1">
                <QRCodeCanvas
                  value={`${window.location.origin}/appointment/${selectedHospital._id}`}
                  size={80}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <button
                type="button"
                onClick={() => navigate(`/appointment/${selectedHospital._id}`)}
                className="text-[9px] font-black text-[#0b645b] uppercase tracking-wider cursor-pointer hover:underline"
              >
                Scan to book
              </button>
            </div>
          </section>
        )}

        {/* Hero Section */}
        <section className="bg-[#0b645b] rounded-3xl p-6 md:p-12 flex flex-col md:flex-row items-center justify-between text-white shadow-xl gap-6">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-2xl md:text-4xl font-black mb-3">
              MediCare provides the best healthcare solutions
            </h2>
            <p className="text-sm opacity-90">
              Everything you need to know in minutes
            </p>
          </div>
          <div className="bg-white/10 px-8 py-6 rounded-2xl flex items-center gap-4">
            <div className="text-4xl">🩺</div>
            <p className="font-bold text-sm leading-tight text-left">
              Revolutionizing Healthcare Delivery
            </p>
          </div>
        </section>

        {/* Why Choose Section */}
        <section>
          <h2 className="text-center text-2xl font-black text-gray-900 mb-12">
            WHY CHOOSE MEDICARE?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              {
                title: "Convenient Access",
                desc: "INSTANT MEDICAL CARE",
                icon: "📱",
                color: "bg-pink-50",
              },
              {
                title: "Expert Specialists",
                desc: "TOP DOCTORS ONLINE",
                icon: "👨‍⚕️",
                color: "bg-cyan-50",
              },
              {
                title: "Time & Cost Savings",
                desc: "EFFICIENT CONSULTATIONS",
                icon: "💰",
                color: "bg-orange-50",
              },
              {
                title: "Personalized Treatment",
                desc: "TAILORED HEALTHCARE",
                icon: "🧩",
                color: "bg-green-50",
              },
              {
                title: "Secure & Private",
                desc: "SAFE TELEMEDICINE",
                icon: "🛡️",
                color: "bg-indigo-50",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`${item.color} p-8 rounded-4xl text-center flex flex-col items-center transform hover:scale-105 transition-transform`}
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl mb-6 shadow-sm">
                  {item.icon}
                </div>
                <h3 className="font-black text-sm text-gray-900">
                  {item.title}
                </h3>
                <p className="text-[10px] font-bold text-gray-500 mt-2 tracking-widest uppercase">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Specialties Section */}
        <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <h2 className="text-2xl font-black text-gray-900 mb-10 text-center">
            {selectedSpecialty
              ? `Doctors in ${selectedSpecialty.name}`
              : "Explore Medical Specialties"}
          </h2>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Left: Selector */}
            <div
              className={`grid gap-4 ${selectedSpecialty ? "grid-cols-1 md:w-64" : "grid-cols-2 md:grid-cols-4 lg:grid-cols-6 w-full"}`}
            >
              {(selectedSpecialty ? [selectedSpecialty] : specialties).map(
                (s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSpecialty(s)}
                    className={`flex flex-col items-center justify-center gap-3 p-3 rounded-2xl border transition-all overflow-hidden ${
                      selectedSpecialty?.name === s.name
                        ? `${s.color} text-white shadow-lg`
                        : "bg-slate-50 text-gray-800 border-slate-100 hover:border-slate-300"
                    }`}
                  >
                    {/* Conditional rendering: Emoji when unselected, Full-container Photo when selected */}
                    {selectedSpecialty ? (
                      <img
                        src={s.image}
                        alt={s.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl">{s.icon}</span>
                    )}
                    <span className="font-bold text-xs truncate max-w-full px-1">
                      {s.name}
                    </span>
                  </button>
                ),
              )}

              {selectedSpecialty && (
                <button
                  onClick={() => setSelectedSpecialty(null)}
                  className="mt-4 px-4 py-1.5 bg-red-50 text-red-500 rounded-full font-bold text-[10px] hover:bg-red-100 transition-all border border-red-100 w-fit mx-auto"
                >
                  Clear Selection
                </button>
              )}
            </div>

            {/* Right: Results */}
            {selectedSpecialty && (
              <div className="flex-1">
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap sm:flex-nowrap justify-between items-center gap-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-xl shadow-sm">
                          👨‍⚕️
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-900">
                            Dr. Placeholder {i + 1}
                          </p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mt-0.5">
                            15 Yrs Exp • Fee: ₹{800 + i * 200}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`h-2 w-2 rounded-full ${i % 2 === 0 ? "bg-green-500" : "bg-red-500"}`}
                          ></span>
                          <span
                            className={`text-[9px] font-black uppercase tracking-wider ${i % 2 === 0 ? "text-green-700" : "text-red-700"}`}
                          >
                            {i % 2 === 0 ? "Live" : "Unavailable"}
                          </span>
                        </div>
                        <button className="bg-[#0b645b] text-white text-[10px] font-bold px-4 py-2 rounded-xl hover:bg-[#084e46] transition-all">
                          Book Appointment
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* How to Book Section */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-12 text-center">
            How To Book A Doctor Appointment Online?
          </h2>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              {bookingSteps.map((step, idx) => (
                <div key={idx} className="flex gap-6 items-start">
                  <div className="w-14 h-14 flex items-center justify-center bg-[#0b645b]/10 rounded-full text-2xl shrink-0">
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 text-sm mb-2">
                      {step.title}
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative p-4">
              <div className="bg-[#0b645b] w-full h-80 rounded-3xl -rotate-2 shadow-2xl"></div>
              <img
                src="/doctor.jpg"
                alt="Doctor Consultation"
                className="absolute top-0 left-0 w-full h-80 rounded-3xl object-cover shadow-2xl border-4 border-white"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#0b645b] text-white rounded-3xl p-12 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
          <div className="flex-1 relative z-10">
            <h2 className="text-3xl font-black mb-4">
              Looking for Medical Assistance?
            </h2>
            <p className="text-sm opacity-90 mb-8 max-w-lg leading-relaxed">
              Our network of professional hospitals and specialists is ready to
              assist you. Find the care you deserve by browsing our
              comprehensive list of facilities.
            </p>
            <button
              onClick={scrollToTop}
              className="bg-white text-[#0b645b] px-8 py-3 rounded-full font-bold text-sm shadow-lg hover:bg-gray-100 transition-all hover:scale-105"
            >
              Search Hospitals Now
            </button>
          </div>
          <div className="shrink-0 relative z-10 opacity-50 md:opacity-100">
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center text-5xl">
              🏥
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="pb-16">
          <h2 className="text-2xl font-black text-gray-900 mb-8">FAQ's</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={`w-full p-6 flex justify-between font-bold text-sm transition-colors ${openFaq === i ? "bg-[#0b645b] text-white" : "text-gray-900"}`}
                >
                  {faq.q} <span>{openFaq === i ? "-" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div className="p-6 text-sm bg-[#0b645b]/5 text-gray-700 font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
