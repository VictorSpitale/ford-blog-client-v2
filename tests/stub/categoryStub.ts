import {ICategory} from "../../shared/types/category.type";

export const categoryStub = (name: string): ICategory => {
    return {
        _id: 'id',
        name: name,
    }
}