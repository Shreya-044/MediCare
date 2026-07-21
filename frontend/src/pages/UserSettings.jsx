import { useState } from "react";
import { FiLock, FiBell, FiSave, FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function UserSettings({ userName }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [showPopup, setShowPopup] = useState({ visible: false, message: "", isError: false });
  const [settings, setSettings] = useState({ emailNotifications: true, smsNotifications: false, twoFactorAuth: false });

  const handleVerify = () => {
    if (passwords.current.length > 0) {
      setIsVerified(true);
      setShowPopup({ visible: true, message: "Identity verified. You can now change password.", isError: false });
      setTimeout(() => setShowPopup({ ...showPopup, visible: false }), 3000);
    } else {
      setShowPopup({ visible: true, message: "Please enter your current password.", isError: true });
      setTimeout(() => setShowPopup({ ...showPopup, visible: false }), 3000);
    }
  };

  const handleSave = () => {
    if (passwords.new !== passwords.confirm) {
      setShowPopup({ visible: true, message: "New passwords do not match!", isError: true });
      return;
    }

    if (passwords.new === passwords.current) {
      setShowPopup({ 
        visible: true, 
        message: "New password cannot be the same as your current password.", 
        isError: true 
      });
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(passwords.new)) {
      setShowPopup({ 
        visible: true, 
        message: "Password must have uppercase, lowercase, number, & special symbol (min 8 chars).", 
        isError: true 
      });
      return;
    }

    const nameParts = userName.toLowerCase().split(" ");
    const isNameInPassword = nameParts.some(part => part.length > 2 && passwords.new.toLowerCase().includes(part));
    if (passwords.new.toLowerCase().includes("password") || isNameInPassword) {
        setShowPopup({ 
            visible: true, 
            message: "Password cannot contain common words or your name.", 
            isError: true 
        });
        return;
    }

    setShowPopup({ visible: true, message: "Settings saved successfully!", isError: false });
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-10 py-6 sm:py-10 relative">
      {showPopup.visible && (
        <div className={`fixed top-4 sm:top-10 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 ${showPopup.isError ? "bg-red-500" : "bg-[#0b645b]"} text-white`}>
            {showPopup.isError ? <FiAlertCircle /> : <FiCheckCircle />}
            <span className="text-xs sm:text-sm font-bold whitespace-nowrap">{showPopup.message}</span>
            <button 
            onClick={() => setShowPopup({ ...showPopup, visible: false })}
            className="ml-2 hover:bg-white/20 p-1 rounded-full transition"
            >
            <FiX size={16} />
            </button>
        </div>
        )}

      <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-6 sm:mb-8">Account Settings</h2>

      <div className="space-y-6 sm:space-y-8">
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="flex items-center gap-2 font-black text-sm mb-6"><FiLock className="text-[#0b645b]" /> Security</h3>
          
          <div className="space-y-4">
            <div className="relative">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Current Password</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="password" 
                  disabled={isVerified}
                  onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                  placeholder="Enter current password to verify" 
                  className="w-full p-4 bg-gray-50 rounded-2xl text-sm font-bold outline-none border-2 border-transparent focus:border-[#0b645b]/20"
                />
                {!isVerified && (
                  <button onClick={handleVerify} className="px-6 py-4 sm:py-0 bg-gray-900 text-white rounded-2xl text-xs font-bold whitespace-nowrap hover:bg-black transition">Verify</button>
                )}
              </div>
            </div>

            {isVerified && (
              <>
                {/* New Password with Eye Toggle */}
                <div className="relative pt-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-2">New Password</p>
                  <input type={showPassword ? "text" : "password"} onChange={(e) => setPasswords({...passwords, new: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl text-sm font-bold outline-none border-2 border-transparent focus:border-[#0b645b]/20" />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[46px] text-gray-400">{showPassword ? <FiEyeOff /> : <FiEye />}</button>
                </div>
                
                {/* Confirm Password with Eye Toggle */}
                <div className="relative">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Confirm Password</p>
                  <input type={showPassword ? "text" : "password"} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl text-sm font-bold outline-none border-2 border-transparent focus:border-[#0b645b]/20" />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-10 text-gray-400">{showPassword ? <FiEyeOff /> : <FiEye />}</button>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="flex items-center gap-2 font-black text-sm mb-6"><FiBell className="text-[#0b645b]" /> Notifications</h3>
          <div className="space-y-4">
            {Object.keys(settings).map((key) => (
              <div key={key} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                <span className="text-xs font-bold capitalize text-gray-700">{key.replace(/([A-Z])/g, ' $1')}</span>
                <button onClick={() => setSettings({...settings, [key]: !settings[key]})} className={`w-12 h-6 rounded-full transition flex items-center px-1 ${settings[key] ? "bg-[#0b645b]" : "bg-gray-300"}`}>
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings[key] ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <button onClick={handleSave} className="flex items-center justify-center gap-2 w-full py-4 bg-[#0b645b] text-white rounded-2xl text-sm font-bold hover:bg-[#084e46] transition active:scale-95">
          <FiSave /> Save All Changes
        </button>
      </div>
    </div>
  );
}