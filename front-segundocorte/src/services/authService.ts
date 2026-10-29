import api from './api';

export const login = async (username: string, password: string) => {
    // Retorna la respuesta que contiene el token JWT
    const response = await api.post('/auth/login', {
        username,
        password
    });
    return response.data;
};