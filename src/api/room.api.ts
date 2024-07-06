import { Stay } from './stay.api';
import request from '../configs/request';
import { IResponseAPI } from '../types/responseAPI.type';

export interface RoomModel {
    id?: string;
    name?: string;
    beds?: number;
    amount?: number;
    available?: number;
    price?: number;
    description?: string;
    stay?: Stay;
}

export interface AddRoomRequest {
    name: string;
    beds: number;
    amount: number;
    price: number;
    description: string;
    stayId: string;
}

export const getAllRoom = async (
    stayId: string
): Promise<{ data: RoomModel[] }> => {
    const response = await request.get(`/rooms/${stayId}`);
    const data: IResponseAPI<RoomModel[]> = response.data;

    return {
        data: data.data
    };
};

export const addNewRoom = async (
    dto: AddRoomRequest
): Promise<{ data: RoomModel }> => {
    const response = await request.post(`/rooms/${dto.stayId}`, dto);
    const data: IResponseAPI<RoomModel> = response.data;

    return {
        data: data.data
    };
};
