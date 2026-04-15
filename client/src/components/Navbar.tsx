import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('name');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    navigate('/login');
  };

  return (
    <nav className="w-full bg-[#1e1e2e] text-white px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold tracking-tight">Campus App</div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-5 text-sm">
          <Link to="/" className="hover:text-[#c2ed39] transition-colors">Home</Link>
          <Link to="/book" className="hover:text-[#c2ed39] transition-colors">Book a Hall</Link>
          <Link to="/resources" className="hover:text-[#c2ed39] transition-colors">Resources</Link>
          <Link to="/labs" className="hover:text-[#c2ed39] transition-colors">Lab Timetable</Link>
          <Link to="/my-bookings" className="hover:text-[#c2ed39] transition-colors">My Bookings</Link>
          {role === 'admin' && (
            <Link to="/admin" className="hover:text-[#c2ed39] transition-colors">Admin</Link>
          )}
        </div>

        {/* Desktop user */}
        <div className="hidden md:flex items-center gap-3">
          {token && (
            <>
              <span className="text-sm text-gray-300">Hi, {name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 bg-[#c2ed39] text-black text-sm font-semibold rounded-lg hover:bg-[#b0d930] transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`block w-5 h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-3 pt-4 pb-2 text-sm border-t border-gray-700 mt-3">
          <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-[#c2ed39]">Home</Link>
          <Link to="/book" onClick={() => setMenuOpen(false)} className="hover:text-[#c2ed39]">Book a Hall</Link>
          <Link to="/resources" onClick={() => setMenuOpen(false)} className="hover:text-[#c2ed39]">Resources</Link>
          <Link to="/labs" onClick={() => setMenuOpen(false)} className="hover:text-[#c2ed39]">Lab Timetable</Link>
          <Link to="/my-bookings" onClick={() => setMenuOpen(false)} className="hover:text-[#c2ed39]">My Bookings</Link>
          {role === 'admin' && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="hover:text-[#c2ed39]">Admin</Link>
          )}
          {token && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-700">
              <span className="text-gray-300">Hi, {name}</span>
              <button onClick={handleLogout} className="px-3 py-1 bg-[#c2ed39] text-black text-sm font-semibold rounded-lg">
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;