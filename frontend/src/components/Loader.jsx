import { useEffect } from "react";
import { useLoading } from "../context/LoadingContext";

export default function Loader() {
  const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    const handleLoading = (e) => setIsLoading(e.detail);
    window.addEventListener("loading-state", handleLoading);
    return () => window.removeEventListener("loading-state", handleLoading);
  }, [setIsLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center gap-4">
        <img src="/red-cross.png" alt="MediCare" className="w-20 h-20 animate-pulse" />
        <p className="text-sm font-black text-gray-700 tracking-widest">PLEASE WAIT...</p>
      </div>
    </div>
  );
}