import defaultSrc from '../../public/static/img/default-profile.png'
import {IBasicUser, IUser} from "../types/user.type";

export const getUserPictureSrc = (user: IUser | IBasicUser) => {
    if (process.env.NEXT_PUBLIC_ENV === "development" || !user.picture) return {src: defaultSrc.src, default: true}
    return {src: user.picture, default: false}
}