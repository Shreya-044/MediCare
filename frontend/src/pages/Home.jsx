import { useState } from "react";
import { searchHospitals } from "../services/hospitalService";

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);
  const [search, setSearch] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const handleSearch = async (value) => {
    setSearch(value);

    if (!value.trim()) {
      setHospitals([]);
      return;
    }

    try {
      setLoading(true);

      const response = await searchHospitals(value);

      if (response.success) {
        setHospitals(response.data);
      }

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 -mt-6">
      <div className="max-w-7xl mx-auto px-10">
        {/* Search Bar */}
        <div className="py-12">
          <div className="max-w-3xl mx-auto bg-white rounded-full p-2 shadow-sm border border-gray-200 flex items-center">
            <span className="pl-6 text-[#0b645b]">🔍</span>
            <input
              type="text"
              placeholder="Search hospitals by name or city"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full h-12 px-4 outline-none text-sm text-gray-600"
            />
          </div>
          {loading && (
            <p className="text-center mt-6 text-gray-500">
              Searching...
            </p>
          )}

          {hospitals.length > 0 && (
            <div className="mt-10 space-y-6">
              {hospitals.map((hospital) => (
                <div
                  key={hospital._id}
                  className="bg-white rounded-3xl shadow-lg border p-8 flex justify-between items-center"
                >
                  <div>
                    <h2 className="text-3xl font-bold">
                      {hospital.hospital_name}
                    </h2>

                    <p className="mt-3 text-gray-600">
                      📍 {hospital.address}, {hospital.city}
                    </p>

                    <p className="mt-2 text-teal-700 font-semibold">
                      📞 {hospital.phone}
                    </p>

                    <p className="text-gray-500">
                      {hospital.email}
                    </p>
                  </div>

                  <button className="bg-[#0b645b] text-white px-6 py-3 rounded-xl hover:bg-[#09554d]">
                    View Hospital
                  </button>
                </div>
              ))}
            </div>
          )}

          {!loading &&
 search.trim() !== "" &&
 hospitals.length === 0 && (
  <div className="mt-10 text-center">
    <h2 className="text-2xl font-bold text-gray-700">
      No hospitals found
    </h2>

    <p className="text-gray-500 mt-2">
      Try searching with another hospital name or city.
    </p>
  </div>
)}
        </div>
            {/* Hero Section */}
            <section className="bg-[#0b645b] rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between text-white shadow-xl">
              <div className="max-w-xl">
                <h2 className="text-3xl font-black mb-3">
                  MediCare provides the best
                  <br />healthcare solutions
                </h2>
                <p className="text-sm opacity-90">
                  Everything you need to know in minutes
                </p>
              </div>
              <div className="bg-white/10 px-8 py-6 rounded-2xl flex items-center gap-4">
                <div className="text-3xl">🩺</div>
                <p className="font-bold text-sm leading-tight">
                  Revolutionizing Healthcare
                  <br />
                  Delivery
                </p>
              </div>
            </section>

            {/* Why Choose */}
            <section className="my-16">
              <h2 className="text-center text-2xl font-black text-gray-900 mb-10">
                WHY CHOOSE MEDICARE?
              </h2>
              <div className="grid grid-cols-5 gap-4">
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
                    className={`${item.color} p-8 rounded-4xl text-center flex flex-col items-center`}
                  >
                    {/* Circular icon container */}
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

            {/* FAQ Section */}
            <section>
              <h2 className="text-2xl font-black text-gray-900 mb-6">FAQ's</h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-gray-200 bg-white overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className={`w-full p-5 flex justify-between font-bold text-sm transition-colors ${openFaq === i ? "bg-[#14b8a6] text-white" : "text-gray-900"
                        }`}
                    >
                      {faq.q} <span>{openFaq === i ? "-" : "+"}</span>
                    </button>
                    {openFaq === i && (
                      <div className="p-5 text-sm bg-[#14b8a6] text-white -mt-1">
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
