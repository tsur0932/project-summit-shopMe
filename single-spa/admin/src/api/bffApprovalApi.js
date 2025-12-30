// BFF base URL. The BFF proxies to approval-service under /approval
const BASE_URL = process.env.BFF_BASE || 'http://localhost:3000/approval';


async function http(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });
  if (!res.ok) {
    if (res.status === 401) {
      const intended = window.location.pathname + window.location.search + window.location.hash;
      const redirectUri = encodeURIComponent('http://localhost:9000/auth/callback');
      const bffBase = (process.env.BFF_BASE || 'http://localhost:3000').replace(/\/$/, '');
      window.location.href = `${bffBase}/auth/login?returnTo=${encodeURIComponent(intended)}&redirect_uri=${redirectUri}`;
      return;
    }
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  const json = await res.json();
  return json && json.data !== undefined ? json.data : json;
}


export const ApprovalApi = {
  getPending: () => http('GET', '/products/pending'),
  getRequestByProductId: (productId) => http('GET', `/products/${productId}/request`),
  createRequest: (productId, supplierId) => http('POST', `/products/${productId}/request`, { supplierId }),
  approve: (productId, stewardId) => http('POST', `/products/${productId}/approve`, { stewardId }),
  reject: (productId, stewardId, reason) => http('POST', `/products/${productId}/reject`, { stewardId, reason }),
  getAudit: (productId) => http('GET', `/products/${productId}/audit`),
};






