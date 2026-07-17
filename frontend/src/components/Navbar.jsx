import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-700 text-xl font-bold text-white">
            M
          </div>

          <div>
            <h1 className="text-xl font-bold text-teal-700">
              MediCare
            </h1>
            <p className="-mt-1 text-xs text-gray-500">
              Healthcare Portal
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="font-medium text-gray-700 transition hover:text-teal-700"
          >
            Home
          </Link>

          <Link
            to="/doctors"
            className="font-medium text-gray-700 transition hover:text-teal-700"
          >
            Doctors
          </Link>

          <Link
            to="/specialists"
            className="font-medium text-gray-700 transition hover:text-teal-700"
          >
            Specialists
          </Link>

          <Link
            to="/about"
            className="font-medium text-gray-700 transition hover:text-teal-700"
          >
            About
          </Link>

          <Link
            to="/contact"
            className="font-medium text-gray-700 transition hover:text-teal-700"
          >
            Contact
          </Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <button className="hidden rounded-lg border border-teal-700 px-5 py-2 font-medium text-teal-700 transition hover:bg-teal-700 hover:text-white md:block">
            Login
          </button>

          <button className="rounded-lg bg-teal-700 px-5 py-2 font-medium text-white transition hover:bg-teal-800">
            Sign Up
          </button>

          <FaUserCircle className="hidden text-3xl text-teal-700 md:block" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;