export interface IResponseAPI<T> {
    success: boolean;
    message: string;
    data: T;
    meta?: Meta;
}

export type Meta = {
    page: string;
    limit: string;
    itemCount: number;
    pageCount: number;
    next: string;
    previous: string;
};
