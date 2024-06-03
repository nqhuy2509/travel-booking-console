import axios, { AxiosError, AxiosInstance } from 'axios';
import { getToken } from '../utils/auth';

const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL as string,
    timeout: 30000
});

api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error as AxiosError) {
        }
        const originalRequest = error.config;

        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            return Promise.reject(error.response);
        }

        return Promise.reject(error);
    }
);

export default api;
