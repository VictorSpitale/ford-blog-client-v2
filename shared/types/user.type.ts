export type IUser = {
    _id: string;
    pseudo: string;
    email: string;
    role: IUserRole;
    picture?: string;
    updatedAt: string;
    createdAt: string;
}

export type IBasicUser = Pick<IUser, "_id"> & Pick<IUser, "pseudo"> & Pick<IUser, "picture">

export type UpdateUser = {
    pseudo?: string;
    password?: string;
    currentPassword?: string;
}

export enum IUserRole {
    USER = '0',
    POSTER = '1',
    ADMIN = '2',
}


