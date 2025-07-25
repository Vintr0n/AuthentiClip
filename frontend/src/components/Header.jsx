import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow p-4 mb-6">
      <ul className="flex space-x-4 items-center">
        <li><Link to="/about" className="hover:underline">About</Link></li>
        <li><Link to="/faq" className="hover:underline">FAQ</Link></li>

        {user ? (
          <>
            <li><Link to="/upload" className="hover:underline">Upload</Link></li>
            <li><Link to="/verify" className="hover:underline">Verify</Link></li>
            <li className="ml-auto text-sm text-gray-700">Hi, {user.username}</li>
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login" className="hover:underline">Login</Link></li>
            <li><Link to="/signup" className="hover:underline">Signup</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}
