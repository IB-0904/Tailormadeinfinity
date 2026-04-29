import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1.0/blogsite'
});

api.interceptors.request.use(config => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);
        // Note: For actual basic auth we need the raw password, which we might not want to store,
        // but for this MVP as requested without JWT, we store the credentials locally.
        const authInfo = JSON.parse(localStorage.getItem('authInfo'));
        if (authInfo) {
            config.headers.Authorization = `Basic ${btoa(`${authInfo.email}:${authInfo.password}`)}`;
        }
    }
    return config;
});

export default api;
