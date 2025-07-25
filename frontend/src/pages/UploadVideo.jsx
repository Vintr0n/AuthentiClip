import { useState } from 'react';

export default function UploadVideo() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a video file first.');
      return;
    }

    const formData = new FormData();
    formData.append('video_file', file); // Must match backend param name

    try {
      setIsUploading(true);

      const token = localStorage.getItem('access_token');
      const res = await fetch('https://video-auth-serverside.onrender.com/video/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const result = await res.json();
        setMessage(`Upload successful!\n${JSON.stringify(result, null, 2)}`);
      } else {
        const error = await res.text();
        setMessage(`Upload failed: ${res.status} ${res.statusText}\n${error}`);
      }
    } catch (err) {
      setMessage('Upload failed: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Upload Video</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="block mb-4"
        />
        <button
          type="submit"
          disabled={isUploading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {message && (
        <pre className="mt-4 text-sm text-red-700 whitespace-pre-wrap">{message}</pre>
      )}
    </div>
  );
}
