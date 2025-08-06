import { useEffect, useState } from 'react';
import { authFetch } from '../utils/authFetch';
import Lottie from "lottie-react";
import successAnim from "../assets/lottie/success.json";

export default function UploadVideo() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadHistory, setUploadHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await authFetch('https://video-auth-serverside.onrender.com/video/upload/history');
      if (res.ok) {
        const data = await res.json();
        setUploadHistory(data);
      } else {
        console.error("Failed to fetch upload history");
      }
    } catch (err) {
      console.error("Error fetching history", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

const handleFileChange = (e) => {
  const selectedFile = e.target.files[0];
  if (!selectedFile) return;

  // Limit file size to 30MB
  //Increased to 50
  if (selectedFile.size > 50 * 1024 * 1024) {
    setMessage('File is too large. Maximum allowed size is 50MB.');
    setFile(null);
    return;
  }

  // Check video duration
  const videoElement = document.createElement('video');
  videoElement.preload = 'metadata';
  videoElement.onloadedmetadata = () => {
    URL.revokeObjectURL(videoElement.src);
    if (videoElement.duration > 10) {
      setMessage('Video is too long. Maximum allowed duration is 10 seconds.');
      setFile(null);
    } else {
      setFile(selectedFile);
    }
  };
  videoElement.src = URL.createObjectURL(selectedFile);
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select an appropriate video file first.');
      return;
    }

    setIsUploading(true);
    setMessage('');
    setUploadSuccess(false);

    const uploadFile = file;

    const formData = new FormData();
    formData.append('video_file', uploadFile);

    try {
      const token = localStorage.getItem('access_token');
      const res = await authFetch('https://video-auth-serverside.onrender.com/video/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const result = await res.json();
        setUploadSuccess(true);
        setFile(null);
        fetchHistory();
        setTimeout(() => setUploadSuccess(false), 4000);
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
    <div className="flex justify-center min-h-screen overflow-y-auto items-start mt-10 px-4">
      <div className="w-full sm:max-w-xl bg-[#0e131f] border border-slate-700 p-10 rounded-xl shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Upload Video</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="w-full mb-4 px-4 py-2 rounded bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isUploading}
            className="w-full py-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-bold hover:opacity-90 transition"
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>

          {isUploading && (
            <div className="flex justify-center mt-4">
              <div className="w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </form>

        {uploadSuccess && (
          <div className="mt-6 w-32 mx-auto">
            <Lottie animationData={successAnim} loop={false} />
            <p className="text-center text-green-400 mt-2 font-semibold">Upload successful!</p>
          </div>
        )}

        {!uploadSuccess && message && (
          <pre className="mt-4 text-sm text-green-300 whitespace-pre-wrap">{message}</pre>
        )}

        {uploadHistory.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Previous Uploads</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left border-b border-slate-600">
                  <th className="pb-1">Filename</th>
                  <th className="pb-1">Uploaded At</th>
                  <th className="pb-1">Video ID</th>
                </tr>
              </thead>
              <tbody>
                {uploadHistory.map((item, index) => (
                  <tr key={index} className="border-b border-slate-700">
                    <td className="py-1 pr-2">{item.filename}</td>
                    <td className="py-1">{item.timestamp}</td>
                    <td className="py-1 font-mono text-xs text-slate-400">{item.guid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
