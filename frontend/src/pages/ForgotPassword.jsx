import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
const res = await fetch("https://video-auth-serverside.onrender.com/auth/forgot-password", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ email }),
});


    const data = await res.json();
    if (res.ok) {
      setMessage("Check your email (including junk mail) for a password reset link.");
    } else {
      setMessage(data.detail || "Something went wrong.");
    }
  };

  return (
    <div className="flex justify-center min-h-screen overflow-y-auto items-start mt-10 px-4">
      <div className="w-full sm:max-w-xl bg-[#0e131f] border border-slate-700 p-10 rounded-xl shadow-lg text-white">
        <form onSubmit={handleSubmit} className="flex flex-col justify-between h-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
          <label className="block mb-2">Enter your email:</label>
          <input
            type="email"
            className="w-full p-2 mb-4 text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700"
          >
            Send Reset Link
          </button>
          {message && <p className="mt-4">{message}</p>}
        </form>
      </div>
    </div>
  );
}
