export type IUser = {
    _id: string;
    pseudo: string;
    email: string;
    role: IUserRole;
    updatedAt: string;
    createdAt: string;
}

export enum IUserRole {
    USER = '0',
    POSTER = '1',
    ADMIN = '2',
}