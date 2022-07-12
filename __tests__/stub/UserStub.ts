import {IUser, IUserRole} from "../../shared/types/user.type";

export const UserStub = (role = IUserRole.USER, id = "625d68b498cce1a4044d887c"): IUser => {
    return {
        "_id": id,
        "pseudo": "VictorSpitale",
        "email": "vmairets@gmail.com",
        role,
        "updatedAt": "2022-04-20T20:31:48.670Z",
        "createdAt": "2022-04-18T13:33:40.991Z"
    }
}