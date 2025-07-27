import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Signup failed');

      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md h-[520px] bg-gray-900/80 rounded-xl p-8 shadow-lg text-white flex flex-col justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 mb-4 border border-gray-600 rounded-full bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 mb-6 border border-gray-600 rounded-full bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold transition"
          >
            SIGN UP
          </button>
        </div>

        <p className="text-sm text-center text-gray-300">
          Already have an account?{' '}
          <Link to="/login" className="underline hover:text-yellow-400">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
