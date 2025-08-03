import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../utils/authFetch';

export default function Feedback() {
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(null);
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setStatus('Please include some textual feedback.');
      return;
    }

    setSubmitting(true);
    setStatus('');

    try {
      const res = await authFetch('https://video-auth-serverside.onrender.com/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback: message, rating }),
      });

      if (res.ok) {
        setStatus('Thanks for your feedback!');
        setMessage('');
        setRating(null);
      } else {
        setStatus('Failed to submit feedback.');
      }
    } catch (err) {
      setStatus('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen overflow-y-auto items-start mt-10 px-4">
      <div className="w-full sm:max-w-xl bg-[#0e131f] border border-slate-700 p-10 rounded-xl shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Give Feedback</h2>

        <form onSubmit={handleSubmit}>
          <textarea
            rows="6"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Let us know what you think, or report a bug..."
            className="w-full mb-4 px-4 py-2 rounded bg-black border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />

          <label className="block mb-2 text-sm mt-4">If ClipCert were scaled beyond its current limitations (e.g., 10-second max, MP4-only), how valuable do you think it would be in real-world scenarios?</label>
          <div className="flex justify-between text-sm mb-4">
            {[0, 1, 2, 3, 4].map((val) => (
              <label key={val} className="flex flex-col items-center">
                <input
                  type="radio"
                  name="rating"
                  value={val}
                  checked={rating === val}
                  onChange={() => setRating(val)}
                  className="mb-1"
                />
                {val}
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-bold hover:opacity-90 transition"
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>

        {status && (
          <p className="mt-4 text-sm text-center text-green-300 whitespace-pre-wrap">{status}</p>
        )}
      </div>
    </div>
  );
}
