import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
<<<<<<< HEAD
  const [user, setUser] = useState(() => {
    // Initialize synchronously from localStorage to avoid flash/race
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);
=======
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);
>>>>>>> main

  const login = (userData, token) => {
    localStorage.setItem("currentUser", JSON.stringify(userData));

    if (token) {
      localStorage.setItem("token", token);
    }

    setUser(userData);
  };

  const logOut = () => {
<<<<<<< HEAD
    localStorage.removeItem('currentUser');
=======
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
>>>>>>> main
    setUser(null);
  };

  const updateProfile = (updates) => {
    const updated = { ...user, ...updates };
<<<<<<< HEAD
    setUser(updated);
    localStorage.setItem('currentUser', JSON.stringify(updated));
  };

  const login = (userData) => {
    localStorage.setItem("currentUser", JSON.stringify(userData));
    setUser(userData);
=======

    setUser(updated);
    localStorage.setItem(
      "currentUser",
      JSON.stringify(updated)
    );
>>>>>>> main
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