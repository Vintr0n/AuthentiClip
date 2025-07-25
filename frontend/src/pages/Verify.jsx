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
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Verify Video</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="block mb-4"
        />
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={handleUsernameChange}
          className="block w-full mb-4 border px-3 py-2 rounded"
        />
        <button
          type="submit"
          disabled={isVerifying}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {isVerifying ? 'Verifying...' : 'Verify'}
        </button>
      </form>
      {message && (
        <pre className="mt-4 text-sm text-blue-800 whitespace-pre-wrap">{message}</pre>
      )}
    </div>
  );
}
