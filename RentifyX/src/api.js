/**
 * api.js — Centralized fetch wrapper for RentifyX
 * Automatically attaches Authorization: Bearer <token> header.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

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
 * Make an authenticated API request.
 * @param {string} endpoint  - e.g. "/auth/me"
 * @param {object} options   - fetch options (method, body, etc.)
 * @returns {Promise<any>}   - parsed JSON response
 */
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

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
    // If token is expired/invalid, auto-logout
    if (res.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
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
