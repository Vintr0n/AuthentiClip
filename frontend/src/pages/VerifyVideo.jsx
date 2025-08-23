// frontend/src/pages/VerifyVideo.jsx
import { useState } from "react";
import { authFetch } from "../utils/authFetch";

export default function VerifyVideo() {
  const [username, setUsername] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setResult(null);

    if (!username || !videoUrl) {
      setMessage("Please provide both a username and a video URL.");
      return;
    }

    setIsVerifying(true);
    try {
      const token = localStorage.getItem("access_token");
      const form = new FormData();
      form.append("username", username);
      form.append("video_url", videoUrl);

      const res = await authFetch("https://video-auth-serverside.onrender.com/video/verify-by-url", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form
      });

      if (!res.ok) {
        const text = await res.text();
        setMessage(`Verification failed: ${res.status} ${res.statusText}\n${text}`);
        return;
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen overflow-y-auto items-start mt-10 px-4">
      <div className="w-full sm:max-w-xl bg-[#0e131f] border border-slate-700 p-10 rounded-xl shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify From URL</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Target username</label>
            <input
              type="email"
              placeholder="user@example.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Video URL</label>
            <input
              type="url"
              placeholder="https://x.com/i/status/1955943890982142134"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full px-4 py-2 rounded bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-slate-400 mt-1">
              Paste a public link to a post containing the video.
            </p>
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-bold hover:opacity-90 transition"
          >
            {isVerifying ? "Verifying..." : "Verify"}
          </button>
        </form>

        {message && (
          <pre className="mt-4 text-sm text-green-300 whitespace-pre-wrap">{message}</pre>
        )}

        {result && (
          <div className="mt-6 p-4 rounded-lg bg-black/40 border border-slate-600">
            <div className="text-sm">Username: <span className="font-mono">{result.username}</span></div>
            <div className="text-sm">Match count: {result.match_count} / {result.total_uploaded_hashes}</div>
            <div className="text-sm">Match percentage: {result.match_percentage}%</div>
            <div className={`mt-2 font-semibold ${result.verified ? "text-green-400" : "text-red-400"}`}>
              {result.verified ? "Verified" : "Not verified"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
