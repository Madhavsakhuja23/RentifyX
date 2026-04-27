/**
 * api.js — Centralized fetch wrapper for RentifyX
 * Sends userId in Authorization header for authenticated requests.
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const parseJsonSafely = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
};

/**
 * Make an API request.
 * @param {string} endpoint  - e.g. "/auth/me"
 * @param {object} options   - fetch options (method, body, etc.)
 * @returns {Promise<any>}   - parsed JSON response
 */
export const apiRequest = async (endpoint, options = {}) => {
  let token = null;

  try {
    token = localStorage.getItem("token");
  } catch {
    token = null;
  }

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  let res;

  try {
    res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (error) {
    throw new Error("Unable to connect to the backend API.");
  }

  const data = await parseJsonSafely(res);

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("currentUser");
      window.location.href = "/login";
    }
    throw new Error(data?.msg || data?.message || "Request failed");
  }

  return data;
};

export const publicApiRequest = async (endpoint, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  let res;

  try {
    res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (error) {
    throw new Error("Unable to connect to the backend API.");
  }

  const data = await parseJsonSafely(res);

  if (!res.ok) {
    throw new Error(data?.msg || data?.message || "Request failed");
  }

  return data;
};

const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (typeof value === "string" && !value.trim()) return;
    if (typeof value === "boolean") {
      query.set(key, String(value));
      return;
    }

    query.set(key, String(value));
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
};

export const getDwellings = (params = {}) =>
  publicApiRequest(`/listings${buildQueryString({ category: "Dwelling", ...params })}`);

export const getListingById = (id) =>
  publicApiRequest(`/listings/${id}`);

// ── Convenience methods ──────────────────────────────────────

export const getMe = () => apiRequest("/auth/me");

export const loginApi = (email, password) =>
  publicApiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const signupApi = (name, email, password, role) =>
  publicApiRequest("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password, role }),
  });

export const googleAuthApi = (name, email, photo, role) =>
  publicApiRequest("/auth/google", {
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

/**
 * Axios-like default API instance for use with `import api from './api'`
 * Supports: api.get(url), api.post(url, data), api.patch(url, data), api.delete(url)
 */
const api = {
  get: (endpoint) => apiRequest(endpoint),
  post: (endpoint, data) =>
    apiRequest(endpoint, { method: "POST", body: JSON.stringify(data) }),
  patch: (endpoint, data) =>
    apiRequest(endpoint, { method: "PATCH", body: data ? JSON.stringify(data) : undefined }),
  delete: (endpoint) => apiRequest(endpoint, { method: "DELETE" }),
  put: (endpoint, data) =>
    apiRequest(endpoint, { method: "PUT", body: JSON.stringify(data) }),
};

export default api;
