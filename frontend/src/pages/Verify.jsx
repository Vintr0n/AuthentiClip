import { useState } from 'react';
import { authFetch } from '../utils/authFetch';

export default function Verify() {
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !username) {
      setMessage('Please provide both a video file and a username.');
      return;
    }

    const formData = new FormData();
    formData.append('video_file', file);
    formData.append('username', username);

    try {
      setIsVerifying(true);
      const token = localStorage.getItem('access_token');
      const res = await authFetch('https://video-auth-serverside.onrender.com/video/verify', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const result = await res.json();
        setMessage(`Verification successful:\n${JSON.stringify(result, null, 2)}`);
      } else {
        const error = await res.text();
        setMessage(`Verification failed: ${res.status} ${res.statusText}\n${error}`);
      }
    } catch (err) {
      setMessage('Verification failed: ' + err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0e131f] px-4">
      <div className="bg-[#0e131f] p-8 rounded-xl shadow-xl w-full max-w-md text-white border border-slate-700">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify Video</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="w-full mb-4 px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={handleUsernameChange}
            className="w-full mb-4 px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-2 rounded bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-bold hover:opacity-90 transition"
          >
            {isVerifying ? 'Verifying...' : 'Verify'}
          </button>
        </form>
        {message && (
          <pre className="mt-4 text-sm text-green-300 whitespace-pre-wrap">{message}</pre>
        )}
      </div>
    </div>
  );
}
