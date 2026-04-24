const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

async function parseJsonSafe(response) {
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const data = await parseJsonSafe(response);

  if (!response.ok) {
    throw new Error(data.msg || "Request failed");
  }

  return data;
}

function getAuthHeaders(extraHeaders = {}) {
  const token = localStorage.getItem("seller_token");

  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };
}

export const sellerSignupApi = (name, email, password) =>
  request("/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      email,
      password,
      role: "owner",
    }),
  });

export const sellerLoginApi = (email, password) =>
  request("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

export const getSellerProfileApi = () =>
  request("/auth/me", {
    headers: getAuthHeaders(),
  });

export const getMyListingsApi = () =>
  request("/listings/mine", {
    headers: getAuthHeaders(),
  });

export const createListingApi = (formData) =>
  request("/listings", {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

export const updateListingApi = (id, updates) =>
  request(`/listings/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(updates),
  });

export const deleteListingApi = (id) =>
  request(`/listings/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
