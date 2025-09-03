import axios from 'axios';

// Don't set baseURL - let Vite proxy handle /api requests
// The proxy in vite.config.js forwards /api to http://localhost:8080

// Configure default headers
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Add request interceptor to handle authentication token
axios.interceptors.request.use(
  (config) => {
    // Add debugging
    console.log('Axios request config:', {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
      headers: config.headers
    });

    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Axios request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle CORS and other issues
axios.interceptors.response.use(
  (response) => {
    console.log('Axios response success:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Axios response error:', error);
    console.error('Error config:', error.config);
    console.error('Error response:', error.response);
    return Promise.reject(error);
  }
);

export default axios;