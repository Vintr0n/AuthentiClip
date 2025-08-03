import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const passwordIsValid = (password) => {
    const minLength = 8;
    const hasNumber = /\d/;
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>-]/;
    return (
      password.length >= minLength &&
      hasNumber.test(password) &&
      hasSpecial.test(password)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!passwordIsValid(password)) {
      setError(
        "Password must be at least 8 characters long and include at least one number and one special character."
      );
      return;
    }

    const res = await fetch("https://video-auth-serverside.onrender.com/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ token, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(data.message);
    } else {
      setError(data.detail || "Something went wrong.");
    }
  };

  return (
    <div className="flex justify-center min-h-screen overflow-y-auto items-start mt-10 px-4">
      <div className="w-full sm:max-w-xl bg-[#0e131f] border border-slate-700 p-10 rounded-xl shadow-lg text-white">
        <form onSubmit={handleSubmit} className="flex flex-col justify-between h-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Choose New Password</h2>
          <label className="block mb-2">Enter a new password:</label>
          <input
            type="password"
            className="w-full p-2 mb-4 text-black"
            placeholder="New password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700"
          >
            Reset Password
          </button>
          {error && <p className="text-red-400 mt-4">{error}</p>}
          {message && <p className="text-green-400 mt-4">{message}</p>}
        </form>
      </div>
    </div>
  );
}
