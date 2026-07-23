import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchHospitals } from "../services/hospitalService";
import { QRCodeCanvas } from "qrcode.react";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);

  // Carousel State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const searchRef = useRef(null);
  const topRef = useRef(null);

  const specialties = [
    {
      name: "General Practitioner",
      icon: "🩺",
      image: "/general_practitioner.jpg",
      color: "bg-teal-600",
    },
    { name: "Dental", icon: "🦷", image: "/dental.jpg", color: "bg-blue-600" },
    {
      name: "Orthopedics",
      icon: "🦴",
      image: "/orthopedics.jpg",
      color: "bg-amber-600",
    },
    {
      name: "Pediatrics",
      icon: "👶",
      image: "/pediatrics.jpg",
      color: "bg-purple-600",
    },
    {
      name: "Obstetrics Gynecology",
      icon: "👩‍🍼",
      image: "/obstetrics_gynecology.jpg",
      color: "bg-pink-600",
    },
    {
      name: "Cardiology",
      icon: "❤️",
      image: "/cardiology.jpg",
      color: "bg-red-600",
    },
    {
      name: "Psychology",
      icon: "🧠",
      image: "/psychology.jpg",
      color: "bg-indigo-600",
    },
    {
      name: "Oncology",
      icon: "🔬",
      image: "/oncology.jpg",
      color: "bg-stone-600",
    },
    { name: "ENT", icon: "👂", image: "/ENT.jpg", color: "bg-orange-600" },
    {
      name: "Neurology",
      icon: "⚡",
      image: "/neurology.jpg",
      color: "bg-sky-600",
    },
    {
      name: "Physiotherapy",
      icon: "🏃",
      image: "/physiotherapy.jpg",
      color: "bg-green-600",
    },
    {
      name: "Radiology",
      icon: "☢️",
      image: "/radiology.jpg",
      color: "bg-gray-600",
    },
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

  // Auto-cycle logic
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % specialties.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused, specialties.length]);

  const handleNext = () => {
    setIsPaused(true);
    setCurrentIndex((prev) => (prev + 1) % specialties.length);
    setTimeout(() => setIsPaused(false), 3000); // Resume auto-cycle after 3s of inactivity
  };

  const handlePrev = () => {
    setIsPaused(true);
    setCurrentIndex(
      (prev) => (prev - 1 + specialties.length) % specialties.length,
    );
    setTimeout(() => setIsPaused(false), 3000); // Resume auto-cycle after 3s of inactivity
  };

  const currentSpecialty = specialties[currentIndex];

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

        {/* Carousel Specialties Section */}
        <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <button
              onClick={handlePrev}
              className="p-1 hover:bg-slate-100 rounded-full text-xl font-bold text-gray-600 transition-colors"
            >
              {"<"}
            </button>
            <h2 className="text-2xl font-black text-gray-900 text-center">
              Top Doctors in {currentSpecialty.name}
            </h2>
            <button
              onClick={handleNext}
              className="p-1 hover:bg-slate-100 rounded-full text-xl font-bold text-gray-600 transition-colors"
            >
              {">"}
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Left: Image */}
            <div className="w-full md:w-1/3">
              <img
                src={currentSpecialty.image}
                alt={currentSpecialty.name}
                className="w-full h-64 object-cover rounded-2xl shadow-sm"
              />
            </div>

            {/* Right: Results */}
            <div className="flex-1">
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div
                    key={i}
                    className="relative bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-shadow"
                  >
                    {/* Mobile-Only Status Dot (Absolute Top Right) */}
                    <span
                      className={`absolute top-4 right-4 md:hidden text-[9px] font-black uppercase ${
                        i % 2 === 0 ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      ●
                    </span>

                    {/* Doctor Info Group */}
                    <div className="flex flex-col items-center md:flex-row md:items-center gap-3 w-full text-center md:text-left">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-sm border border-slate-100 shrink-0">
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

                    {/* Action Group: Status + Button */}
                    <div className="flex flex-col items-center md:items-end gap-1 w-full md:w-auto">
                      <span
                        className={`hidden md:inline text-[9px] font-black uppercase ${
                          i % 2 === 0 ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {i % 2 === 0 ? "● LIVE" : "● UNAVAILABLE"}
                      </span>
                      <button className="bg-[#0b645b] text-white text-[10px] font-bold px-4 py-2 rounded-xl hover:bg-[#084e46] w-full md:w-auto mt-1 whitespace-nowrap">
                        Book Appointment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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

        {/* Healthcare Promise Section - Animated */}
        <section className="bg-[#0b645b] text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
          {/* Subtle Background Decorative Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />

          {/* Styles for animation injection */}
          <style>{`
            @keyframes highlight-card {
              0%, 25% { border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.15); transform: translateY(-8px); box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
              26%, 100% { border-color: rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); transform: translateY(0); box-shadow: none; }
            }
          `}</style>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Clinical Excellence",
                desc: "World-class diagnostic standards delivered by board-certified medical professionals.",
              },
              {
                step: "02",
                title: "Patient-Centered",
                desc: "Tailored treatment protocols designed around your unique health history.",
              },
              {
                step: "03",
                title: "Digital Integration",
                desc: "Seamless connectivity between your wearable devices and our clinical dashboard.",
              },
              {
                step: "04",
                title: "Preventive Focus",
                desc: "Proactive screening and wellness monitoring to catch health risks early.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 flex flex-col justify-between"
                style={{
                  animation: `highlight-card 8s infinite ${i * 2}s`,
                }}
              >
                {/* Step Indicator & Accent Line */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black tracking-widest text-[#d1e7e4]/60">
                      {item.step}
                    </span>
                    <div className="w-8 h-[2px] bg-white/20" />
                  </div>

                  <h3 className="text-lg font-black text-white mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#d1e7e4] leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                {/* Subtle accent dot */}
                <div className="mt-4 flex items-center gap-1.5"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Knowledge Hub */}
        <section className="py-20 px-4 bg-gray-50 -mt-22">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-4">
                Wellness Insights
              </h2>
              <p className="text-gray-500">
                Curated expertise for a healthier lifestyle.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1: Large Spotlight */}
              <div className="md:col-span-2 bg-[#0b645b] rounded-[2rem] p-10 text-white relative overflow-hidden group">
                <h3 className="text-3xl font-black mb-4">
                  The Future of <br />
                  Preventive Care
                </h3>
                <p className="text-white/70 max-w-sm mb-8">
                  Understanding the shift from reactive treatments to proactive
                  wellness monitoring.
                </p>
                <button className="bg-white text-[#0b645b] px-6 py-2 rounded-full font-bold text-sm">
                  Read Story
                </button>
                <div className="absolute -bottom-10 -right-10 text-[160px] opacity-10 rotate-12">
                  🧬
                </div>
              </div>

              {/* Feature 2: Small Box */}
              <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-2xl mb-6">
                  🧘
                </div>
                <h4 className="font-bold text-lg mb-2">Mindful Living</h4>
                <p className="text-gray-500 text-sm">
                  Techniques to reduce stress in a fast-paced world.
                </p>
              </div>

              {/* Feature 3: Small Box */}
              <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-2xl mb-6">
                  🥗
                </div>
                <h4 className="font-bold text-lg mb-2">Nutrition Guide</h4>
                <p className="text-gray-500 text-sm">
                  Simple changes for a balanced, energetic diet.
                </p>
              </div>

              {/* Feature 4: Small Box */}
              <div className="md:col-span-2 bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-lg mb-2">
                    Weekly Health Newsletter
                  </h4>
                  <p className="text-gray-500 text-sm">
                    Join 50k+ subscribers for tips.
                  </p>
                </div>
                <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Health Tips / Daily Wellness Section */}
        <section className="relative my-16 py-12 px-4">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
            {/* Breaking Element: Floating Graphic */}
            <div className="w-full md:w-2/5 flex justify-center">
              <div className="relative w-64 h-64 bg-slate-100 rounded-3xl flex items-center justify-center border-4 border-white shadow-xl rotate-3">
                <div className="text-8xl">🍎</div>
                {/* Decorative subtle badge */}
                <div className="absolute -top-4 -left-4 bg-[#0b645b] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg">
                  Daily Tip
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-black text-gray-900 mb-6">
                Small Steps to Better Health
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                You don't need a medical degree to stay healthy. From consistent
                sleep schedules to mindful hydration, small daily habits
                compound into significant long-term wellness improvements.
              </p>
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="font-bold text-[#0b645b] text-sm">
                    Hydrate Well
                  </p>
                  <p className="text-[10px] text-gray-500">
                    8 glasses of water daily.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="font-bold text-[#0b645b] text-sm">
                    Stay Active
                  </p>
                  <p className="text-[10px] text-gray-500">
                    30 mins of movement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Patient Preparation Checklist */}
        <section className="relative my-16 py-12 px-4">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
            {/* Text Content */}
            <div className="flex-1 text-left">
              <h2 className="text-3xl font-black text-gray-900 mb-6">
                Preparing for Your Visit
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Making sure you are prepared for your appointment helps us
                provide the best care. Keep these essential items ready to
                ensure a smooth and efficient consultation process.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-[#0b645b] font-bold mt-1">01</span>
                  <div>
                    <p className="font-bold text-gray-900">Medical Records</p>
                    <p className="text-xs text-gray-500">
                      Bring your latest history or digital reports.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#0b645b] font-bold mt-1">02</span>
                  <div>
                    <p className="font-bold text-gray-900">
                      Current Medications
                    </p>
                    <p className="text-xs text-gray-500">
                      List of any prescriptions you currently take.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Graphic on the Right */}
            <div className="w-full md:w-2/5 flex justify-center">
              <div className="relative w-64 h-72 bg-slate-100 rounded-3xl border-4 border-white shadow-2xl flex flex-col items-center justify-center -rotate-2">
                <div className="text-6xl mb-6">📋</div>
                <div className="w-3/4 h-2 bg-[#0b645b]/20 rounded-full mb-3"></div>
                <div className="w-3/4 h-2 bg-[#0b645b]/20 rounded-full mb-3"></div>
                <div className="w-1/2 h-2 bg-[#0b645b]/20 rounded-full"></div>

                {/* Decorative Tag */}
                <div className="absolute -bottom-4 bg-[#0b645b] text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg">
                  Checklist
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#0b645b] text-white rounded-3xl p-12 flex flex-col md:flex-row-reverse items-center gap-8 shadow-2xl relative overflow-hidden">
          <div className="shrink-0 relative z-10 opacity-50 md:opacity-100">
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center text-5xl">
              🏥
            </div>
          </div>
          <div className="flex-1 relative z-10 text-center md:text-left">
            <h2 className="text-3xl font-black mb-4">
              Looking for Medical Assistance?
            </h2>
            <p className="text-sm opacity-90 mb-8 max-w-lg leading-relaxed mx-auto md:mx-0">
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
