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
      return;
    }

    fetch(`https://video-auth-serverside.onrender.com/auth/verify-email?token=${token}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.detail || 'Verification failed.');
        }
        setMessage('Email verified. You may now log in.');
        setTimeout(() => navigate('/login'), 1500);
      })
      .catch((err) => {
        setError(err.message || 'Verification error');
      });
  }, [navigate, searchParams]);

  return (
    <div className="flex justify-center min-h-screen overflow-y-auto items-start mt-10 px-4">
      <div className="w-full sm:max-w-xl bg-[#0e131f] border border-slate-700 p-10 rounded-xl shadow-lg text-white">
        <img src={logo} alt="ClipCert Logo" className="w-28 mx-auto mb-6 motion-safe:animate-pulse" />
        {error ? (
          <p className="text-red-400 text-lg">{error}</p>
        ) : (
          <p className="text-green-400 text-lg">{message}</p>
        )}
      </div>
    </div>
  );
}
