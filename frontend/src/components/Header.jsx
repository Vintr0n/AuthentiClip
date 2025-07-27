import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Header = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) =>
    location.pathname === path ? "bg-cyan-700 text-white" : "hover:text-cyan-400";

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-transparent text-white font-semibold">
      <div className="text-lg font-bold tracking-wide">ClipCert</div>
      <nav className="flex space-x-4">
        {!user && (
          <>
            <Link to="/login" className={`px-3 py-1 rounded-full ${isActive("/login")}`}>
              Login
            </Link>
            <Link to="/signup" className={`px-3 py-1 rounded-full ${isActive("/signup")}`}>
              Signup
            </Link>
          </>
        )}
        <Link to="/about" className={`px-3 py-1 rounded-full ${isActive("/about")}`}>
          About
        </Link>
        <Link to="/faq" className={`px-3 py-1 rounded-full ${isActive("/faq")}`}>
          FAQ
        </Link>
        {user && (
          <>
            <Link to="/upload" className={`px-3 py-1 rounded-full ${isActive("/upload")}`}>
              Upload
            </Link>
            <Link to="/verify" className={`px-3 py-1 rounded-full ${isActive("/verify")}`}>
              Verify
            </Link>
            <button
              onClick={logout}
              className="px-3 py-1 rounded-full bg-red-500 hover:bg-red-600 text-white"
            >
              Logout
            </button>
            <span className="ml-2 text-sm italic opacity-70">Hello, {user}</span>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
