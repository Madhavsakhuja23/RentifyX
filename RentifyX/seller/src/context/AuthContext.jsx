import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('seller_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const signUp = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('seller_users') || '[]');
    const exists = users.find((u) => u.email === email);
    if (exists) {
      throw new Error('A user with this email already exists.');
    }
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      phone: '',
      paymentMethod: '',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem('seller_users', JSON.stringify(users));
    const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem('seller_user', JSON.stringify(sessionUser));
    setUser(sessionUser);
  };

  const logIn = (email, password) => {
    const users = JSON.parse(localStorage.getItem('seller_users') || '[]');
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) {
      throw new Error('Invalid email or password.');
    }
    const sessionUser = { id: found.id, name: found.name, email: found.email };
    localStorage.setItem('seller_user', JSON.stringify(sessionUser));
    setUser(sessionUser);
  };

  const logOut = () => {
    localStorage.removeItem('seller_user');
    setUser(null);
  };

  const updateProfile = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('seller_user', JSON.stringify(updated));
    // Also update in users list
    const users = JSON.parse(localStorage.getItem('seller_users') || '[]');
    const idx = users.findIndex((u) => u.id === updated.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      localStorage.setItem('seller_users', JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, logIn, logOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
