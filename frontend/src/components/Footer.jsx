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
    <footer className="bg-teal-800 text-white mt-20">
      <div className="max-w-7xl mx-auto px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-bold text-sm tracking-wider mb-5">
                {section.title}
              </h3>

              <ul className="space-y-3 text-sm text-teal-100">
                {section.links.map((link) => (
                  <li
                    key={link}
                    className="hover:text-white cursor-pointer transition"
                  >
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-teal-600 mt-10 pt-6 text-center text-sm text-teal-200">
          © {new Date().getFullYear()} MediCare. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}