import { createAxiosClient, unwrapResponse } from '../utils/http.js';
import { CART_SERVICE_URL } from '../config.js';


const client = createAxiosClient({ baseURL: CART_SERVICE_URL });


export const cartService = {
  async createCart(userId) {
    const resp = await client.post('/api/v1/carts', { userId });
    return unwrapResponse(resp);
  },
  async getCartById(cartId) {
    const resp = await client.get(`/api/v1/carts/${encodeURIComponent(cartId)}`);
    return unwrapResponse(resp);
  },
  async getCartByUserId(userId) {
    const resp = await client.get(`/api/v1/users/${encodeURIComponent(userId)}/cart`);
    return unwrapResponse(resp);
  },
  async addItem(cartId, { productId, quantity }) {
    const resp = await client.post(`/api/v1/carts/${encodeURIComponent(cartId)}/items`, { productId, quantity });
    return unwrapResponse(resp);
  },
  async removeItem(cartId, itemId) {
    const resp = await client.delete(`/api/v1/carts/${encodeURIComponent(cartId)}/items/${encodeURIComponent(itemId)}`);
    return unwrapResponse(resp);
  },
  async clearItems(cartId) {
    const resp = await client.delete(`/api/v1/carts/${encodeURIComponent(cartId)}/items`);
    return unwrapResponse(resp);
  },
};






