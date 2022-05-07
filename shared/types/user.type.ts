export type IUser = {
    _id: string;
    pseudo: string;
    email: string;
    role: IUserRole;
    picture?: string;
    updatedAt: string;
    createdAt: string;
}

export type UpdateUser = {
    pseudo?: string;
    password?: string;
}

export enum IUserRole {
    USER = '0',
    POSTER = '1',
    ADMIN = '2',
}


