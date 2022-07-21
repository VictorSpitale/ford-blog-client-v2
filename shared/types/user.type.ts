import {Translation} from "../hooks/useTranslation";

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
    role?: "0" | "1" | "2";
}

export enum IUserRole {
    USER = '0',
    POSTER = '1',
    ADMIN = '2',
}

export const displayRole = (role: IUserRole, t: Translation) => {
    switch (role) {
        case IUserRole.POSTER:
            return t.common.roles.poster
        case IUserRole.USER:
            return t.common.roles.user
        case IUserRole.ADMIN:
            return t.common.roles.admin
        default:
            return t.common.roles.user
    }
}


