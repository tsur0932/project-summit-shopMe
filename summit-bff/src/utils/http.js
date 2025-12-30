import axios from 'axios';


export function createAxiosClient({ baseURL, timeout = 10000, headers = {} } = {}) {
  return axios.create({ baseURL, timeout, headers });
}


export function unwrapResponse(resp) {
  if (resp && resp.data) {
    const body = resp.data;
    if (body && typeof body === 'object' && 'data' in body) return body.data;
    return body;
  }
  return resp;
}






