import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo-squared.png';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const passwordIsValid = (password) => {
    const minLength = 8;
    const hasNumber = /\d/;
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/;
    return (
      password.length >= minLength &&
      hasNumber.test(password) &&
      hasSpecial.test(password)
    );
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== password2) {
      setError('Passwords do not match.');
      return;
    }

    if (!passwordIsValid(password)) {
      setError('Password must be at least 8 characters long and include at least one number and one special character.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://video-auth-serverside.onrender.com/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          username: email,
          password: password,
          password2: password2,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Signup failed');

      setMessage('Signup successful! Check your emails including junk mail to verify your account. Redirecting you to login page...');
      setTimeout(() => navigate('/login'), 7000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen overflow-y-auto items-start mt-10 px-4">
      <div className="w-full sm:max-w-xl bg-[#0e131f] border border-slate-700 p-10 rounded-xl shadow-lg text-white">
        <form onSubmit={handleSignup} className="flex flex-col justify-between h-auto">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 mb-4 border border-gray-600 rounded-full bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 mb-4 border border-gray-600 rounded-full bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              className="w-full px-4 py-3 mb-6 border border-gray-600 rounded-full bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            {message && <p className="text-green-400 text-sm mb-4">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-semibold hover:opacity-90 transition"
            >
              {loading ? 'Signing up...' : 'Sign up'}
            </button>

            {loading && (
              <div className="flex justify-center mt-4">
                <div className="w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          <img
            src={logo}
            alt="ClipCert Logo"
            className="w-40 mx-auto mt-6 motion-safe:animate-pulse"
          />

          <p className="text-sm text-center text-gray-300 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="underline hover:text-cyan-300">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
