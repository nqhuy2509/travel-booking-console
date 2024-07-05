import { Stay } from './stay.api';
import request from '../configs/request';
import { IResponseAPI } from '../types/responseAPI.type';

export interface RoomModel {
    id?: string;
    name?: string;
    beds?: number;
    available?: number;
    price?: number;
    description?: string;
    stay?: Stay;
}

export const getAllRoom = async (
    stayId: string
): Promise<{ data: RoomModel[] }> => {
    try {
        const response = await request.get(`/rooms/${stayId}`);
        const data: IResponseAPI<RoomModel[]> = response.data;

        return {
            data: data.data
        };
    } catch (error) {
        throw error;
    }
};
