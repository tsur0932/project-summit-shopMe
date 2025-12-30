import { APPROVAL_SERVICE_URL } from '../config.js';
import { createAxiosClient, unwrapResponse } from '../utils/http.js';


const client = createAxiosClient({
  baseURL: `${APPROVAL_SERVICE_URL}/api/v1/steward`,
  timeout: 8000,
});


export const ApprovalService = {
  getPending() {
    return client.get('/products/pending').then(unwrapResponse);
  },
  getRequestById(requestId) {
    return client.get(`/requests/${requestId}`).then(unwrapResponse);
  },
  getRequestByProductId(productId) {
    return client.get(`/products/${productId}/request`).then(unwrapResponse);
  },
  createRequest(productId, supplierId) {
    return client.post(`/products/${productId}/request`, { supplierId }).then(unwrapResponse);
  },
  approve(productId, stewardId) {
    return client.post(`/products/${productId}/approve`, { stewardId }).then(unwrapResponse);
  },
  reject(productId, stewardId, reason) {
    return client.post(`/products/${productId}/reject`, { stewardId, reason }).then(unwrapResponse);
  },
  getAudit(productId) {
    return client.get(`/products/${productId}/audit`).then(unwrapResponse);
  },
};






