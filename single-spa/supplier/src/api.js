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
    credentials: 'include',
    ...opts,
  });
  if (!res.ok) {
    if (res.status === 401) {
      const intended = window.location.pathname + window.location.search + window.location.hash;
      const redirectUri = encodeURIComponent('http://localhost:9000/auth/callback');
      const url = `${BASE_URL}/auth/login?returnTo=${encodeURIComponent(intended)}&redirect_uri=${redirectUri}`;
      console.log("Redirecting to login:", url);
      window.location.href = url;
      return;
    }
    let message = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      throw new Error(data?.error || data?.message || message);
    } catch (_) {
      throw new Error(message);
    }
  }
  if (res.status === 204) return null;
  return res.json();
}


export const supplierApi = {
  getAllProducts: () => fetchJson(`/products`),
  addProduct: (product) => fetchJson(`/products/supplier`, { method: "POST", body: JSON.stringify(product) }),
  updateProduct: (productId, product) => fetchJson(`/products/supplier/${productId}`, { method: "PUT", body: JSON.stringify(product) }),
  deleteProduct: (productId) => fetchJson(`/products/supplier/${productId}`, { method: "DELETE" }),
};






