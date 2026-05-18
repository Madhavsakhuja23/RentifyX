/**
 * api.js — Centralized fetch wrapper for RentifyX
 * Supports both authenticated and public requests.
 */

const BASE_URL = `${import.meta.env.VITE_API_URL}/api` || "http://localhost:5000/api";

const parseJsonSafely = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return null;
  try {
    return await response.json();
  } catch {
    return null;
  }
};

/**
 * Authenticated API request (sends JWT token).
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
    res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  } catch (error) {
    throw new Error("Unable to connect to the backend API.");
  }

  const data = await parseJsonSafely(res);

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("token");
    }
    throw new Error(data?.msg || data?.message || "Request failed");
  }

  return data;
};

/**
 * Public API request (no auth token required).
 */
export const publicApiRequest = async (endpoint, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  let res;
  try {
    res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
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
    query.set(key, String(value));
  });
  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
};

// ── Listings ──────────────────────────────────────────────────

export const getDwellings = (params = {}) =>
  publicApiRequest(`/listings${buildQueryString({ category: "Dwelling", ...params })}`);

export const getVehicleListings = (params = {}) =>
  publicApiRequest(`/listings${buildQueryString({ category: "Vehicle", ...params })}`);

export const getVehicles = (params = {}) =>
  publicApiRequest(`/vehicles${buildQueryString(params)}`);

export const getListings = (params = {}) =>
  publicApiRequest(`/listings${buildQueryString(params)}`);

export const getListingById = (id) =>
  publicApiRequest(`/listings/${id}`);

// ── Auth ──────────────────────────────────────────────────────

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
    body: JSON.stringify({ name, email, photo, role }),
  });

export const updateProfileApi = (updates) =>
  apiRequest("/auth/profile", {
    method: "PUT",
    body: JSON.stringify(updates),
  });

// ── Bookings ──────────────────────────────────────────────────

export const checkAvailabilityApi = (listingId, checkIn, checkOut) =>
  publicApiRequest("/bookings/check-availability", {
    method: "POST",
    body: JSON.stringify({ listingId, checkIn, checkOut }),
  });

export const createBookingApi = (bookingData) =>
  apiRequest("/bookings", {
    method: "POST",
    body: JSON.stringify(bookingData),
  });

export const getMyBookingsApi = () => apiRequest("/bookings");



// ── Wishlist ──────────────────────────────────────────────────

export const getWishlistApi = () => apiRequest("/wishlist");

export const addToWishlistApi = (listingId) =>
  apiRequest("/wishlist/add", {
    method: "POST",
    body: JSON.stringify({ listingId }),
  });

export const removeFromWishlistApi = (listingId) =>
  apiRequest("/wishlist/remove", {
    method: "POST",
    body: JSON.stringify({ listingId }),
  });

// ── Seller Listing Management ─────────────────────────────────

export const createListingApi = async (formData) => {
  let token = null;
  try {
    token = localStorage.getItem("token");
  } catch {
    token = null;
  }

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let res;
  try {
    res = await fetch(`${BASE_URL}/listings`, {
      method: "POST",
      headers,
      body: formData,
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

export const updateListingApi = (id, updates) =>
  apiRequest(`/listings/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });

export const deleteListingApi = (id) =>
  apiRequest(`/listings/${id}`, { method: "DELETE" });

// ── Axios-like default instance (for components using `import api from './api'`) ──

const api = {
  get: (endpoint) => apiRequest(endpoint),
  post: (endpoint, data) =>
    apiRequest(endpoint, { method: "POST", body: JSON.stringify(data) }),
  patch: (endpoint, data) =>
    apiRequest(endpoint, { method: "PATCH", body: data ? JSON.stringify(data) : undefined }),
  put: (endpoint, data) =>
    apiRequest(endpoint, { method: "PUT", body: JSON.stringify(data) }),
  delete: (endpoint) => apiRequest(endpoint, { method: "DELETE" }),
};

export default api;
