const BASE_URL = process.env.BFF_URL || "http://localhost:3000";
// import { CART_ENDPOINTS } from "@ecommerce/api-util";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
});


export async function fetchJson(path, opts = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
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
  return res.json();
}



export const cartApi = {
  getUserCart: (userId) => fetchJson(`/cart/user/${encodeURIComponent(userId)}`),
  createCart: (userId) => fetchJson(`/cart/`, { method: "POST", body: JSON.stringify({ userId }) }),
  getCart: (cartId) => fetchJson(`/cart/${cartId}`),
  getCartDetails: (cartId) => fetchJson(`/cart/${cartId}/details`),
  addItem: (cartId, productId, quantity) =>
    fetchJson(`/cart/${cartId}/items`, { method: "POST", body: JSON.stringify({ productId, quantity }) }),
  removeItem: (cartId, itemId) => fetchJson(`/cart/${cartId}/items/${itemId}`, { method: "DELETE" }),
  clear: (cartId) => fetchJson(`/cart/${cartId}/items`, { method: "DELETE" }),
};

// export const cartApi = {
//   getUserCart: (userId) => fetchJson(CART_ENDPOINTS.USER_CART(userId)),
//   createCart: (userId) => fetchJson(CART_ENDPOINTS.CREATE(userId), { method: "POST", body: JSON.stringify({ userId }) }),
//   getCart: (cartId) => fetchJson(CART_ENDPOINTS.GET(cartId)),
//   getCartDetails: (cartId) => fetchJson(CART_ENDPOINTS.CART_DETAILS(cartId)),
//   addItem: (cartId, productId, quantity) =>
//     fetchJson(CART_ENDPOINTS.ADD(cartId, productId, quantity), { method: "POST", body: JSON.stringify({ productId, quantity }) }),
//   removeItem: (cartId, itemId) => fetchJson(CART_ENDPOINTS.REMOVE(cartId,itemId), { method: "DELETE" }),
//   clear: (cartId) => fetchJson(CART_ENDPOINTS.CLEAR(cartId), { method: "DELETE" }),
// };




