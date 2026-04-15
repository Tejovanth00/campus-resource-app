import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const role = sessionStorage.getItem('role');
  const name = sessionStorage.getItem('name');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('userType');
    navigate('/login', { replace: true });
  };

  return (
    <nav className="bg-[#1e1e2e] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#c2ed39] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-[#1e1e2e]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.84L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.84l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <span className="text-white font-bold text-xl">CampusHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {token ? (
              <>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-[#c2ed39] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <Link
                  to="/book"
                  className="text-gray-300 hover:text-[#c2ed39] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Book Resource
                </Link>
                <Link
                  to="/resources"
                  className="text-gray-300 hover:text-[#c2ed39] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Resources
                </Link>
                <Link
                  to="/labs"
                  className="text-gray-300 hover:text-[#c2ed39] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Lab Timetable
                </Link>
                <Link
                  to="/my-bookings"
                  className="text-gray-300 hover:text-[#c2ed39] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  My Bookings
                </Link>
                {role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-gray-300 hover:text-[#c2ed39] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Admin
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-[#c2ed39] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-[#c2ed39] text-[#1e1e2e] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#b0d930] transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* User Menu / Mobile Menu Button */}
          <div className="flex items-center">
            {token && (
              <div className="hidden md:flex items-center space-x-4 mr-4">
                <span className="text-gray-300 text-sm">Welcome, {name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden bg-gray-800 p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#1e1e2e] border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {token ? (
              <>
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-300 hover:text-[#c2ed39] block px-3 py-2 rounded-md text-base font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/book"
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-300 hover:text-[#c2ed39] block px-3 py-2 rounded-md text-base font-medium"
                >
                  Book Resource
                </Link>
                <Link
                  to="/resources"
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-300 hover:text-[#c2ed39] block px-3 py-2 rounded-md text-base font-medium"
                >
                  Resources
                </Link>
                <Link
                  to="/labs"
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-300 hover:text-[#c2ed39] block px-3 py-2 rounded-md text-base font-medium"
                >
                  Lab Timetable
                </Link>
                <Link
                  to="/my-bookings"
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-300 hover:text-[#c2ed39] block px-3 py-2 rounded-md text-base font-medium"
                >
                  My Bookings
                </Link>
                {role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-300 hover:text-[#c2ed39] block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Admin
                  </Link>
                )}
                <div className="border-t border-gray-700 pt-4 mt-4">
                  <div className="flex items-center justify-between px-3">
                    <span className="text-gray-300 text-sm">Welcome, {name}</span>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-700"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-300 hover:text-[#c2ed39] block px-3 py-2 rounded-md text-base font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="bg-[#c2ed39] text-[#1e1e2e] block px-3 py-2 rounded-md text-base font-semibold"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
