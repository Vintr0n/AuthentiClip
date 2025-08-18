import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import logo from '../assets/logo-squared.png';

export default function VerifyEmail() {
  const [message, setMessage] = useState('Verifying your email...');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setError('Missing verification token.');
      setMessage(null);
      return;
    }

    fetch(`https://video-auth-serverside.onrender.com/auth/verify-email?token=${token}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.detail || 'Verification failed.');
        }
        setMessage('Email verified. You may now log in.');
      })
      .catch((err) => {
        setMessage(null);
        setError(err.message || 'Verification error');
      });
  }, [searchParams]);

  useEffect(() => {
    if (message === 'Email verified. You may now log in.') {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [message, navigate]);

  return (
    <div className="flex justify-center min-h-screen overflow-y-auto items-start mt-10 px-4">
      <div className="w-full sm:max-w-xl bg-[#0e131f] border border-slate-700 p-10 rounded-xl shadow-lg text-white">
        <img
          src={logo}
          alt="ClipCert Logo"
          className="w-28 mx-auto mb-6 motion-safe:animate-pulse"
        />

        {message && (
          <div className="mb-6 bg-green-200 text-green-800 text-sm px-4 py-2 rounded text-center">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-200 text-red-800 text-sm px-4 py-2 rounded text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
