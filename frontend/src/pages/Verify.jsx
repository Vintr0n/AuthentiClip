import { useState } from 'react';
import { authFetch } from '../utils/authFetch';
import { convertMovToMp4 } from '../utils/convertVideo';

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

    setIsVerifying(true);
    setMessage('');

    let videoToUpload = file;

    if (file.name.toLowerCase().endsWith('.mov')) {
      try {
        videoToUpload = await convertMovToMp4(file);
      } catch (err) {
        setIsVerifying(false);
        setMessage('Video conversion failed: ' + err.message);
        return;
      }
    }

    const formData = new FormData();
    formData.append('video_file', videoToUpload);
    formData.append('username', username);

    try {
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
    <div className="flex justify-center min-h-screen overflow-y-auto items-start mt-10 px-4">
      <div className="w-full sm:max-w-xl bg-[#0e131f] border border-slate-700 p-10 rounded-xl shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify Video</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="w-full mb-4 px-4 py-2 rounded bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={handleUsernameChange}
            className="w-full mb-4 px-4 py-2 rounded bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-bold hover:opacity-90 transition"
          >
            {isVerifying ? 'Verifying...' : 'Verify'}
          </button>

          {isVerifying && (
            <div className="flex justify-center mt-4">
              <div className="w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </form>

        {message && (
          <pre className="mt-4 text-sm text-green-300 whitespace-pre-wrap">{message}</pre>
        )}
      </div>
    </div>
  );
}
