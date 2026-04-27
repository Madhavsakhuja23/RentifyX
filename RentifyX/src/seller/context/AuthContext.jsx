import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("currentUser");

      if (storedToken) {
        try {
          const { getMe } = await import("../../api");
          const data = await getMe();
          setUser(data.user);
          localStorage.setItem("currentUser", JSON.stringify(data.user));
        } catch (err) {
          console.error("Token validation failed", err);
          localStorage.removeItem("token");
          localStorage.removeItem("currentUser");
          setUser(null);
        }
      } else if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("currentUser", JSON.stringify(userData));

    if (token) {
      localStorage.setItem("token", token);
    }

    setUser(userData);
  };

  const logOut = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    setUser(null);
  };

  const updateProfile = (updates) => {
    const updated = { ...user, ...updates };

    setUser(updated);
    localStorage.setItem(
      "currentUser",
      JSON.stringify(updated)
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logOut,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}