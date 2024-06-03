import axios from 'axios';
import request from '../configs/request';
import { IResponseAPI, Meta } from '../types/responseAPI.type';

export type Category = {
    id: number;
    name: string;
    description: string;
};

export type Stay = {
    id: string;
    name: string;
    type: string;
    image: string;
    status: string;
    description: string;
    location: {
        lat: number;
        lng: number;
        address: string;
        district: string;
        province: string;
    };
};

export type AddressVNApiResponse<T> = {
    results: [T];
};

export type Province = {
    province_id: number;
    province_name: string;
    province_type: string;
};

export type District = {
    district_id: number;
    district_name: string;
    district_type: string;
    province_id: number;
};

export const getAllStaysAPI = async (
    page: number,
    rowsPerPage: number
): Promise<{ data: Stay[]; meta: Meta | undefined }> => {
    try {
        const response = await request.get(
            `/stays?page=${page}&limit=${rowsPerPage}`
        );
        const data: IResponseAPI<Stay[]> = response.data;

        return {
            data: data.data,
            meta: data.meta
        };
    } catch (error) {
        throw error;
    }
};

export const getAllProvincesAPI = async (): Promise<Province[]> => {
    try {
        const response = await axios.get(
            'https://vapi.vnappmob.com/api/province/'
        );
        const data: AddressVNApiResponse<Province> = response.data;

        return data.results;
    } catch (error) {
        throw error;
    }
};

export const getAllDistrictByProvinceAPI = async (
    provinceId: string
): Promise<District[]> => {
    try {
        const response = await axios.get(
            `https://vapi.vnappmob.com/api/province/district/${provinceId}`
        );

        const data: AddressVNApiResponse<District> = response.data;

        return data.results;
    } catch (error) {
        throw error;
    }
};

export const getStayByIdAPI = async (id: string) => {
    try {
        const response = await request.get(`/stay/${id}`);
        const data: IResponseAPI<Stay> = response.data;
        return data.data;
    } catch (error) {
        throw error;
    }
};

export const getAllCategoriesAPI = async () => {
    try {
        const response = await request.get('/category');
        const data: IResponseAPI<Category[]> = response.data;
        return data.data;
    } catch (error) {
        throw error;
    }
};

export const uploadFileProductsAPI = async (data: FormData) => {
    return await request.post('/product/import', data);
};

export const downloadFileProductsAPI = async () => {
    return await request.get('/product/export', {
        responseType: 'blob'
    });
};

export const postNewStayAPI = async (data: FormData) => {
    return await request.post('/stay', data);
};

export const putStayByIdAPI = async ({
    id,
    data
}: {
    id: string;
    data: FormData;
}) => {
    return await request.put(`/stay/${id}`, data);
};

export const deleteStayByIdAPI = (id: string) => {
    return request.delete(`/stay/${id}`);
};
