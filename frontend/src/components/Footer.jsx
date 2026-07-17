const footerLinks = [
  {
    title: "SERVICES",
    links: [
      "Online Doctor Consultation",
      "Book Lab Tests at Home",
      "Medicine Delivery",
      "Health Packages",
    ],
  },
  {
    title: "QUICK LINKS",
    links: [
      "Home",
      "Doctors",
      "Appointments",
      "About",
    ],
  },
  {
    title: "RESOURCES",
    links: [
      "Health Blogs",
      "FAQs",
      "Privacy Policy",
      "Terms & Conditions",
    ],
  },
  {
    title: "LAB TESTS",
    links: [
      "Blood Test",
      "Thyroid Profile",
      "Diabetes Test",
      "Vitamin Check",
    ],
  },
  {
    title: "CONTACT",
    links: [
      "support@medicare.com",
      "+91 98765 43210",
      "New Delhi, India",
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0b645b] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-10 py-16 grid grid-cols-2 md:grid-cols-5 gap-8">
        {footerLinks.map((section) => (
          <div key={section.title}>
            <h3 className="font-black text-[12px] uppercase tracking-widest mb-5">{section.title}</h3>
            <ul className="space-y-3 text-[12px] text-teal-200">
              {section.links.map((link) => (
                <li key={link} className="cursor-pointer hover:text-white transition">{link}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}