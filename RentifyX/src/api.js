/**
 * api.js — Centralized fetch wrapper for RentifyX
 * Sends userId in Authorization header for authenticated requests.
 */

const BASE_URL = "https://rentifyx-ff33.onrender.com/api";

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
  let userId = null;

  try {
    const currentUser = localStorage.getItem("currentUser");
    userId = currentUser ? JSON.parse(currentUser).id : null;
  } catch {
    userId = null;
  }

  const headers = {
    "Content-Type": "application/json",
    ...(userId ? { Authorization: userId } : {}),
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

// Fetch vehicle listings from the Listing model (category = "Vehicle")
// Same endpoint used by Dwellings — data includes title, tagline, description,
// subcategory (Cars|EV|Bike|Bicycle), price, location, and Cloudinary images.
export const getVehicleListings = (params = {}) =>
  publicApiRequest(`/listings${buildQueryString({ category: 'Vehicle', ...params })}`);

// Legacy vehicles route (kept for backward compat / seeded data)
export const getVehicles = (params = {}) =>
  publicApiRequest(`/vehicles${buildQueryString(params)}`);

// Book a vehicle — backend enforces conflict resolution atomically
export const bookVehicle = (vehicleId, userId, startDate, endDate) =>
  publicApiRequest(`/listings/book/${vehicleId}`, {
    method: 'POST',
    body: JSON.stringify({ userId, startDate, endDate }),
  });

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
