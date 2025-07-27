import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const Spinner = () => (
  <div className="flex justify-center items-center mt-4">
    <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('https://video-auth-serverside.onrender.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('access_token', data.access_token);
        login(formData.username);
        navigate('/upload');
      } else {
        const error = await res.text();
        setMessage(`Login failed: ${error}`);
      }
    } catch (err) {
      setMessage('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen overflow-hidden">
      <div className="w-full max-w-md bg-[#0e131f] border border-slate-700 p-8 rounded-xl shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="username"
            type="text"
            placeholder="Email"
            value={formData.username}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-2 rounded bg-black border border-gray-700 text-white"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-2 rounded bg-black border border-gray-700 text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-bold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {loading && <Spinner />}
        </form>
        {message && <p className="mt-4 text-sm text-red-400">{message}</p>}
      </div>
    </div>
  );
}
