import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("access_token"));

  // Called after login to set the user manually
  const login = (email) => {
    setUser({ email });
    setToken(localStorage.getItem("access_token"));
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    setToken(null);
  };

  const refreshAuth = () => {
    setToken(localStorage.getItem("access_token")); // trigger fetchUser
  };

  useEffect(() => {
    async function fetchUser() {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("https://video-auth-serverside.onrender.com/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Session invalid");

        const data = await res.json();
        setUser(data.username || data.email || data);
      } catch (err) {
        localStorage.removeItem("access_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    setLoading(true);
    fetchUser();
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshAuth, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
