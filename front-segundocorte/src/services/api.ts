import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Ajusta el puerto si tu Spring Boot usa otro
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para agregar el token a las cabeceras de cada petición
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;