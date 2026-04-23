/**
 * api.js — Centralized fetch wrapper for RentifyX
 * Sends userId in Authorization header for authenticated requests.
 */

const BASE_URL = "http://localhost:5000/api";

/**
 * Make an API request.
 * @param {string} endpoint  - e.g. "/auth/me"
 * @param {object} options   - fetch options (method, body, etc.)
 * @returns {Promise<any>}   - parsed JSON response
 */
export const apiRequest = async (endpoint, options = {}) => {
  const currentUser = localStorage.getItem("currentUser");
  const userId = currentUser ? JSON.parse(currentUser).id : null;

  const headers = {
    "Content-Type": "application/json",
    ...(userId ? { Authorization: userId } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("currentUser");
      window.location.href = "/login";
    }
    throw new Error(data.msg || "Request failed");
  }

  return data;
};

// ── Convenience methods ──────────────────────────────────────

export const getMe = () => apiRequest("/auth/me");

export const loginApi = (email, password) =>
  apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const signupApi = (name, email, password, role) =>
  apiRequest("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password, role }),
  });

export const googleAuthApi = async (name, email, photo, role) =>
  apiRequest("/auth/google", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      photo,
      role
    }),
  });

export const updateProfileApi = (updates) =>
  apiRequest("/auth/profile", {
    method: "PUT",
    body: JSON.stringify(updates),
  });
