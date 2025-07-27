import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('https://video-auth-serverside.onrender.com/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Signup failed');

      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full max-w-md h-[520px] bg-gray-800/70 backdrop-blur-md rounded-xl p-8 shadow-lg text-white flex flex-col justify-between">
      <h2 className="text-3xl font-montserrat font-bold text-center mb-4">Create Account</h2>

      <form onSubmit={handleSignup} className="space-y-6 flex-grow">
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
          className="w-full h-12 rounded-full bg-primary hover:bg-accent transition-colors text-white uppercase font-montserrat font-semibold tracking-wide"
        >
          Sign Up
        </button>
      </form>

      <div className="text-center text-white text-sm mt-4">
        Already have an account?{' '}
        <span className="underline cursor-pointer" onClick={() => navigate('/login')}>
          Login
        </span>
      </div>
    </div>
  );
}
