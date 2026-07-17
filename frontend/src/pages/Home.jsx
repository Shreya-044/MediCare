import { useState } from "react";

export default function Home() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="bg-slate-50">

      {/* Hero Section */}
      <section className="bg-teal-700 rounded-3xl p-10 my-12 flex flex-col md:flex-row items-center justify-between text-white shadow-xl">
        <div>
          <h2 className="text-4xl font-black mb-4 leading-tight">
            MediCare provides the best healthcare solutions
          </h2>

          <p className="text-lg opacity-90">
            Everything you need to know in minutes.
          </p>

          <button className="mt-8 bg-white text-teal-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-100 transition">
            Book Appointment
          </button>
        </div>

        <div className="mt-8 md:mt-0 bg-white/10 backdrop-blur-md rounded-3xl p-8">
          <div className="text-6xl text-center">🩺</div>

          <h3 className="text-xl font-bold mt-5">
            Revolutionizing Healthcare Delivery
          </h3>

          <p className="mt-2 opacity-90">
            Consult certified doctors anytime from anywhere.
          </p>
        </div>
      </section>

      {/* Why Choose */}
      <section className="my-20">
        <h2 className="text-center text-3xl font-black text-slate-900 mb-14">
          WHY CHOOSE MEDICARE?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

          {[
            {
              title: "Convenient Access",
              desc: "Instant Medical Care",
              icon: "📱",
            },
            {
              title: "Expert Specialists",
              desc: "Top Doctors Online",
              icon: "👨‍⚕️",
            },
            {
              title: "Time & Cost Savings",
              desc: "Affordable Consultations",
              icon: "💰",
            },
            {
              title: "Personalized Treatment",
              desc: "Tailored Healthcare",
              icon: "🧩",
            },
            {
              title: "Secure & Private",
              desc: "100% Confidential",
              icon: "🛡️",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-3xl shadow-md p-6 text-center hover:-translate-y-2 transition duration-300"
            >
              <div className="w-20 h-20 rounded-full bg-teal-50 mx-auto flex items-center justify-center text-4xl">
                {item.icon}
              </div>

              <h3 className="mt-6 font-bold text-slate-900">
                {item.title}
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                {item.desc}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* FAQ */}
      <section className="my-20">
        <h2 className="text-3xl font-black mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">

          {[
            {
              q: "How does Medicare work?",
              a: "Book appointments with certified doctors, consult online, and receive digital prescriptions.",
            },
            {
              q: "Can I consult specialists?",
              a: "Yes. We have specialists from multiple medical departments.",
            },
            {
              q: "Is online consultation safe?",
              a: "Absolutely. Your consultation and medical records remain private and secure.",
            },
            {
              q: "Can I cancel appointments?",
              a: "Yes. Cancellation and refund policies apply.",
            },
          ].map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow"
            >
              <button
                onClick={() =>
                  setOpenFaq(openFaq === index ? null : index)
                }
                className="w-full flex justify-between items-center px-6 py-5 font-semibold"
              >
                {faq.q}

                <span className="text-2xl">
                  {openFaq === index ? "−" : "+"}
                </span>
              </button>

              {openFaq === index && (
                <div className="px-6 pb-5 text-slate-600">
                  {faq.a}
                </div>
              )}
            </div>
          ))}

        </div>
      </section>

    </div>
  );
}