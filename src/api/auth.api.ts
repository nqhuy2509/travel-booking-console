import request from '../configs/request';
import { IResponseAPI } from '../types/responseAPI.type';

export type IUser = {
    role: string;
    username: string;
    stayId: string;
};

export type AuthResponse = {
    token: string;
    username: string;
    role: string;
    stayId: string;
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

export const registerAPI = async (data: {
    username: string;
    password: string;
    stayId?: string;
}) => {
    try {
        const response = await request.post('/admin/register', {
            username: data.username,
            password: data.password,
            stayId: data.stayId
        });
        const result: IResponseAPI<any> = response.data;
        return result.data;
    } catch (error) {
        throw error;
    }
};

export const logoutAPI = (userId: number) => {
    return request.post(`/auth/logout?userId=${userId}`);
};
