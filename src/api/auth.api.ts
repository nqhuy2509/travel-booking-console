import request from '../configs/request';
import { IResponseAPI } from '../types/responseAPI.type';

export type IUser = {
    role: string;
    id: number;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
};

export type AuthResponse = {
    token: string;
    id: string;
    username: string;
};

export const loginAPI = async (data: {
    username: string;
    password: string;
}) => {
    try {
        const response = await request.post('/admin/login', {
            username: data.username,
            password: data.password
        });
        const result: IResponseAPI<AuthResponse> = response.data;
        return result.data;
    } catch (error) {
        throw error;
    }
};

export const logoutAPI = (userId: number) => {
    return request.post(`/auth/logout?userId=${userId}`);
};

export const refreshTokenAPI = (userId: string, refreshToken: string) => {
    return request.post('/auth/refresh', { userId, refreshToken });
};
