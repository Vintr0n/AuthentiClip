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
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      localStorage.setItem('access_token', data.access_token);
      refreshAuth();
      navigate('/upload');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full max-w-md bg-black rounded-xl p-8 shadow-lg text-white">
      <h2 className="text-3xl font-montserrat font-bold text-center mb-8">
        Welcome Back
      </h2>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="relative">
          <input
            type="email"
            placeholder="Email"
            className="w-full h-12 pl-12 pr-4 rounded-full bg-black text-white placeholder-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent"
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
            className="w-full h-12 pl-12 pr-4 rounded-full bg-black text-white placeholder-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white">
            <i className="fa fa-lock"></i>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          className="w-full h-12 rounded-full bg-primary hover:bg-accent transition-colors text-white uppercase font-montserrat font-semibold tracking-wide"
        >
          Login
        </button>
      </form>

      <div className="text-center text-white text-sm mt-6">
        Forgot your password? <span className="underline cursor-pointer">Recover</span>
      </div>

      <div className="text-center text-white text-sm mt-2">
        Don’t have an account?{' '}
        <span
          className="underline cursor-pointer"
          onClick={() => navigate('/signup')}
        >
          Sign up
        </span>
      </div>
    </div>
  );
}
