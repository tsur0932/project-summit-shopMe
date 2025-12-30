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
      try { sessionStorage.setItem('postLoginRedirect', intended); } catch (_) {}
      const redirectUri = encodeURIComponent('http://localhost:9000/auth/callback');
      const url = `${BASE_URL}/auth/login?returnTo=${encodeURIComponent(intended)}&redirect_uri=${redirectUri}`;
      window.location.href = url;
      return; // stop further processing
    }
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
  getAllProducts: () => fetchJson(`/products`),
  getCategories: () => fetchJson("/products/categories"),
  getCategoryProducts: (categoryId) => fetchJson(`/products/categories/${categoryId}/products`),
  search: (productName, page = 1, limit = 50) =>
    fetchJson(`/products/search?productName=${encodeURIComponent(productName)}&page=${page}&limit=${limit}`),
  getById: (productId) => fetchJson(`/products/${productId}`),
};

export const cartApi = {
  getUserCart: (userId) =>
    fetchJson(`/cart/user/${encodeURIComponent(userId)}`),

  getMyCart: () => fetchJson(`/cart/my`),

  createCart: (userId) =>
    fetchJson(`/cart`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    }),

  getCart: (cartId) => fetchJson(`/cart/${cartId}`),

  getCartDetails: (cartId) =>
    fetchJson(`/cart/${cartId}/details`),

  addItem: (cartId, productId, quantity) =>
    fetchJson(`/cart/${cartId}/items`, {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    }),

  removeItem: (cartId, itemId) =>
    fetchJson(`/cart/${cartId}/items/${itemId}`, {
      method: "DELETE",
    }),

  clear: (cartId) =>
    fetchJson(`/cart/${cartId}/items`, {
      method: "DELETE",
    }),
};


// export const productsApi = {
//   getAllProducts: () => fetchJson(PRODUCTS_ENDPOINTS.BASE),
//   getCategories: () => fetchJson(PRODUCTS_ENDPOINTS.CATEGORIES),
//   getCategoryProducts: (categoryId) =>
//     fetchJson(PRODUCTS_ENDPOINTS.CATEGORY_PRODUCTS(categoryId)),
//   search: (productName, page, limit) =>
//     fetchJson(PRODUCTS_ENDPOINTS.SEARCH(productName, page, limit)),
//   getById: (productId) => fetchJson(PRODUCTS_ENDPOINTS.BY_ID(productId)),
// };







