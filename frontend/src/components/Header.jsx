import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import useIsMobile from '../hooks/useIsMobile';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogout = async () => {
    const token = localStorage.getItem('access_token');
    await fetch('https://video-auth-serverside.onrender.com/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.removeItem('access_token');
    logout();
    navigate('/login');
  };

  const handleProtectedClick = (e, path) => {
    if (!user) {
      e.preventDefault();
      setMessage("Please login first");
	  
navigate("/login", { state: { from: path } });
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-full text-sm font-medium transition ${
      isActive ? 'bg-accent text-white' : 'text-white hover:bg-gray-700/60'
    }`;

  if (isMobile) {
    return (
      <header className="w-full bg-gray-900 px-4 py-3 text-white relative z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="w-8 h-8" />
            <h1 className="text-lg font-bold">ClipCert</h1>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none border p-2 rounded-md border-white"
          >
            <div className="w-5 h-0.5 bg-white mb-1" />
            <div className="w-5 h-0.5 bg-white mb-1" />
            <div className="w-5 h-0.5 bg-white" />
          </button>
        </div>

        {message && (
          <div className="mt-2 bg-yellow-200 text-black text-sm py-2 px-4 rounded text-center">
            {message}
          </div>
        )}

        {menuOpen && (
          <div className="mt-3 bg-gray-800 rounded-lg p-4 space-y-2 shadow-lg absolute left-4 right-4 top-full">
            <nav className="flex flex-col gap-2">
              {!user && (
                <>
                  <NavLink to="/login" className={navLinkClass} onClick={() => setMenuOpen(false)}>Login</NavLink>
                  <NavLink to="/signup" className={navLinkClass} onClick={() => setMenuOpen(false)}>Signup</NavLink>
                </>
              )}
              <NavLink to="/about" className={navLinkClass} onClick={() => setMenuOpen(false)}>About</NavLink>
              <NavLink to="/POC" className={navLinkClass} onClick={() => setMenuOpen(false)}>POC</NavLink>
              <NavLink to="/FAQ" className={navLinkClass} onClick={() => setMenuOpen(false)}>FAQ</NavLink>
              <NavLink to="/demo" className={navLinkClass} onClick={() => setMenuOpen(false)}>Demo</NavLink>
              <NavLink to="/contact" className={navLinkClass} onClick={() => setMenuOpen(false)}>Contact</NavLink>
              <NavLink to="/upload" className={navLinkClass} onClick={(e) => { handleProtectedClick(e, "/upload"); setMenuOpen(false); }}>Upload</NavLink>
              <NavLink to="/verify" className={navLinkClass} onClick={(e) => { handleProtectedClick(e, "/verify"); setMenuOpen(false); }}>Verify</NavLink>
              <NavLink to="/feedback" className={navLinkClass} onClick={(e) => { handleProtectedClick(e, "/feedback"); setMenuOpen(false); }}>Feedback</NavLink>
            </nav>

            {user && (
              <>
                <div className="text-xs text-gray-300 text-center">Hello, {user}</div>
                <button
                  onClick={handleLogout}
                  className="w-full py-1 text-sm bg-red-600 rounded-full hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </header>
    );
  }

  // Desktop layout
  return (
    <header className="relative w-full px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-2 absolute left-6 top-1/2 transform -translate-y-1/2">
        <img src="/logo.png" alt="Logo" className="w-10 h-10" />
        <h1 className="text-xl font-bold font-montserrat text-white-200">ClipCert</h1>
      </div>

      <div className="w-full flex justify-center">
        <nav className="bg-gray-800/70 backdrop-blur-md px-6 py-2 rounded-full flex space-x-4 shadow-lg">
          {!user && (
            <>
              <NavLink to="/login" className={navLinkClass}>Login</NavLink>
              <NavLink to="/signup" className={navLinkClass}>Signup</NavLink>
            </>
          )}
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
          <NavLink to="/POC" className={navLinkClass}>POC</NavLink>
          <NavLink to="/FAQ" className={navLinkClass}>FAQ</NavLink>
          <NavLink to="/demo" className={navLinkClass}>Demo</NavLink>
          <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
          <NavLink to="/upload" className={navLinkClass} onClick={(e) => handleProtectedClick(e, "/upload")}>Upload</NavLink>
          <NavLink to="/verify" className={navLinkClass} onClick={(e) => handleProtectedClick(e, "/verify")}>Verify</NavLink>
          <NavLink to="/feedback" className={navLinkClass} onClick={(e) => handleProtectedClick(e, "/feedback")}>Feedback</NavLink>
        </nav>
      </div>

      {message && (
        <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-yellow-200 text-black text-sm py-2 px-4 rounded shadow-md z-50">
          {message}
        </div>
      )}

      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex items-center space-x-4">
        {user && (
          <>
            <span className="text-sm text-white font-medium hidden sm:inline-block">
              Hello, {user}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}
