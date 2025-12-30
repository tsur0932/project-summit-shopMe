const BASE_URL = process.env.BFF_URL || "http://localhost:3000";


// const getAuthHeaders = () => {
//   const token = localStorage.getItem("authToken");
//   const headers = { "Content-Type": "application/json" };
//   if (token) headers["Authorization"] = `Bearer ${token}`;
//   return headers;
// };


export async function fetchJson(path, opts = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
    credentials: "include", // ✅ ensures cookies (tokens) are sent
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

  return res.json();
}



export const productsApi = {
  getById: (productId) => fetchJson(`/products/${productId}`),
};






