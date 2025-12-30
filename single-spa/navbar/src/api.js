const BASE_URL = process.env.BFF_URL || "http://localhost:3000";


const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};


export async function fetchJson(path, opts = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { ...getAuthHeaders(), ...(opts.headers || {}) },
    ...opts,
  });
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      throw new Error(data?.error || message);
    } catch (_) {
      throw new Error(message);
    }
  }
  console.log('token:', token);
  return res.json();
}


export const navbarApi = {
  search: (productName, page = 1, limit = 50) =>
    fetchJson(`/products/search?productName=${encodeURIComponent(productName)}&page=${page}&limit=${limit}`),
  // logout: () => fetchJson("/auth/logout", { method: "POST" })
};