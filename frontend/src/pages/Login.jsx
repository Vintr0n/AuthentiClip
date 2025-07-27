import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('https://video-auth-serverside.onrender.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username: email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Login failed');

      localStorage.setItem('access_token', data.access_token);
      refreshAuth();
      navigate('/upload');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
<div className="w-full max-w-md h-[520px] bg-white rounded-xl p-8 shadow-lg text-black flex flex-col justify-between">

      <h2 className="text-3xl font-montserrat font-bold text-center mb-4">Welcome Back</h2>

      <form onSubmit={handleLogin} className="space-y-6 flex-grow">
        <div className="relative">
          <input
            type="email"
            placeholder="Email"
            className="w-full h-12 pl-12 pr-4 rounded-full bg-black/70 text-white placeholder-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white">
            <i className="fa fa-envelope"></i>
          </div>
        </div>

        <div className="relative">
          <input
            type="password"
            placeholder="Password"
            className="w-full h-12 pl-12 pr-4 rounded-full bg-black/70 text-white placeholder-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white">
            <i className="fa fa-lock"></i>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

<button
  type="submit"
  className="w-full py-3 mt-2 rounded-full bg-blue-700 hover:bg-blue-800 text-white font-semibold transition"
>
  Login
</button>

      </form>

      <div className="text-center text-white text-sm mt-4">
        Don’t have an account?{' '}
        <span className="underline cursor-pointer" onClick={() => navigate('/signup')}>
          Sign up
        </span>
      </div>
    </div>
  );
}
