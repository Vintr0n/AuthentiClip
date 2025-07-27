import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem('access_token');
    await fetch('https://video-auth-serverside.onrender.com/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.removeItem('access_token');
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-full text-sm font-medium transition ${
      isActive ? 'bg-accent text-white' : 'text-white hover:bg-gray-700/60'
    }`;

  return (
    <header className="w-full px-6 py-4 flex items-center justify-between">
      {/* Logo and title */}
      <div className="flex items-center space-x-2">
        <img src="/logo.png" alt="Logo" className="w-10 h-10" />
        <h1 className="text-xl font-bold font-montserrat">ClipCert</h1>
      </div>

      {/* Centered navigation */}
      <nav className="bg-gray-800/70 backdrop-blur-md px-6 py-2 rounded-full flex space-x-4 shadow-lg">
        <NavLink to="/about" className={navLinkClass}>
          About
        </NavLink>
        <NavLink to="/faq" className={navLinkClass}>
          FAQ
        </NavLink>
        {user ? (
          <>
            <NavLink to="/upload" className={navLinkClass}>
              Upload
            </NavLink>
            <NavLink to="/verify" className={navLinkClass}>
              Verify
            </NavLink>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={navLinkClass}>
              Login
            </NavLink>
            <NavLink to="/signup" className={navLinkClass}>
              Signup
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
