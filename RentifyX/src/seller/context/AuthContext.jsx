import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Initialize synchronously from localStorage to avoid flash/race
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const logOut = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  const updateProfile = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('currentUser', JSON.stringify(updated));
  };

  const login = (userData) => {
    localStorage.setItem("currentUser", JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
