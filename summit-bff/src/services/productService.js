import { PRODUCT_SERVICE_URL } from '../config.js';
import { createAxiosClient, unwrapResponse } from '../utils/http.js';
import { normalizeCategory, normalizeProduct } from '../utils/normalizers.js';


const client = createAxiosClient({
  baseURL: PRODUCT_SERVICE_URL,
  timeout: 10000,
});


export const productService = {
  async getAllProducts() {
    const resp = await client.get('/api/v1/products');
    const data = unwrapResponse(resp);
    const list = Array.isArray(data) ? data.map(normalizeProduct) : [];
    return list;
  },
  // async addSupplierProduct(product, headers = {}) {
  //   const resp = await client.post('/api/v1/products/supplier', product, { headers });
  //   const data = unwrapResponse(resp);
  //   return normalizeProduct(data);
  // },
  async addSupplierProduct(product, headers = {}) {
    const resp = await client.post(
        '/api/v1/products/supplier',
        product,
        {
            headers: {
                "Content-Type": "application/json",  // <<< important
                ...headers
            }
        }
    );
    const data = unwrapResponse(resp);
    return normalizeProduct(data);
},

  async updateSupplierProduct(productId, product, headers = {}) {
    const resp = await client.put(`/api/v1/products/supplier/${encodeURIComponent(productId)}`, product, { headers });
    const data = unwrapResponse(resp);
    return normalizeProduct(data);
  },
  async deleteSupplierProduct(productId, headers = {}) {
    const resp = await client.delete(`/api/v1/products/supplier/${encodeURIComponent(productId)}`, { headers });
    return resp.status === 204 ? { success: true } : { success: true };
  },
  async getCategories() {
    const resp = await client.get('/api/v1/categories');
    const data = unwrapResponse(resp);
    const list = Array.isArray(data) ? data.map(normalizeCategory) : [];
    return list;
  },


  async getProductsByCategory(categoryId) {
    const resp = await client.get(`/api/v1/categories/${encodeURIComponent(categoryId)}/products`);
    const data = unwrapResponse(resp);
    const list = Array.isArray(data) ? data.map(normalizeProduct) : [];
    return list;
  },


  async searchProducts(productName) {
    const resp = await client.get('/api/v1/products', { params: { productName } });
    const data = unwrapResponse(resp);
    const list = Array.isArray(data) ? data.map(normalizeProduct) : [];
    return list;
  },


  async getProductById(productId) {
    const resp = await client.get(`/api/v1/products/${encodeURIComponent(productId)}`);
    const data = unwrapResponse(resp);
    return normalizeProduct(data);
  },
};






