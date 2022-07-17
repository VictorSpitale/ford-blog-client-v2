import {IUserRole} from "../../types/user.type";

export type Link = {
    code: string,
    href: string,
    role?: IUserRole
}

export const links: Link[] = [
    {
        code: "0",
        href: "/"
    }, {
        code: "1",
        href: "/news"
    }, {
        code: "2",
        href: "/categories"
    }, {
        code: "3",
        href: "/write",
        role: IUserRole.POSTER
    }, {
        code: "4",
        href: "/contact"
    }, {
        code: "5",
        href: "/account"
    }, {
        code: "6",
        href: "/admin",
        role: IUserRole.ADMIN
    }
]