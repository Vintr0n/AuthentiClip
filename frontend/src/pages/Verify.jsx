import { useState } from 'react';
import { authFetch } from '../utils/authFetch';

const Spinner = () => (
  <div className="flex justify-center items-center mt-4">
    <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function Verify() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await authFetch('https://video-auth-serverside.onrender.com/video/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username }),
      });

      const text = await res.text();
      setMessage(res.ok ? `Success: ${text}` : `Verification failed: ${text}`);
    } catch (err) {
      setMessage('Verification failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen overflow-hidden">
      <div className="w-full max-w-md bg-[#0e131f] border border-slate-700 p-8 rounded-xl shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify Signature</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter username to verify"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full mb-4 px-4 py-2 rounded bg-black border border-gray-700 text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-bold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
          {loading && <Spinner />}
        </form>
        {message && <p className="mt-4 text-sm text-green-300 whitespace-pre-wrap">{message}</p>}
      </div>
    </div>
  );
}
