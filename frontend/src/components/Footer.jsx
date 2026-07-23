export default function Footer() {
  return (
    <footer className="bg-[#0b645b] text-white pt-16 pb-8 px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="space-y-4">
          <h3 className="font-black text-lg text-white">Medicare</h3>
          <p className="text-sm text-white/80">
            Revolutionizing healthcare delivery across the nation.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-white">Quick Links</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
            <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
            <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-white">Support</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li className="hover:text-white cursor-pointer transition-colors">Help Center</li>
            <li className="hover:text-white cursor-pointer transition-colors">Contact Us</li>
            <li className="hover:text-white cursor-pointer transition-colors">Status</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-white">Newsletter</h4>
          <input
            type="email"
            placeholder="Your email"
            className="w-full bg-[#084e46] border border-white/10 p-2 rounded-lg text-sm placeholder-white/50 focus:outline-none focus:border-white/30"
          />
        </div>
      </div>
      <div className="text-center text-xs text-white/60 border-t border-white/20 pt-8">
        © 2026 Medicare. All rights reserved.
      </div>
    </footer>
  );
}