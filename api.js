import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8080/api' });

// Add response interceptor so errors don't crash the app
API.interceptors.response.use(
  res => res,
  err => {
    console.warn('API error:', err.message);
    return Promise.reject(err);
  }
);

export const vendorAPI = {
  getAll:       ()         => API.get('/vendors'),
  getById:      (id)       => API.get(`/vendors/${id}`),
  create:       (data)     => API.post('/vendors', data),
  updateStatus: (id, s)    => API.patch(`/vendors/${id}/status`, null, { params: { status: s } }),
  delete:       (id)       => API.delete(`/vendors/${id}`),
  // NOTE: incrementView endpoint may not exist - wrap in try/catch at call site
  incrementView:(id)       => API.patch(`/vendors/${id}/view`).catch(() => {}),
};

export const productAPI = {
  getAll: () => API.get('/products'),
};

export const priceAPI = {
  byVendor:  (vid)  => API.get(`/prices/vendor/${vid}`),
  byProduct: (pid)  => API.get(`/prices/product/${pid}`),
  setPrice:  (vid, pid, price) =>
    API.post(`/prices/vendor/${vid}/product/${pid}`, null, { params: { price } }),
};

export const reviewAPI = {
  byVendor: (vid)        => API.get(`/reviews/vendor/${vid}`),
  add:      (vid, data)  => API.post(`/reviews/vendor/${vid}`, data),
};
