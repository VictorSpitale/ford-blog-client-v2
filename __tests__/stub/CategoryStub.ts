import {ICategory} from "../../shared/types/category.type";

export const CategoryStub = (name = "sport", _id = "97"): ICategory => {
    return {
        name,
        _id: `6224f160805c5973b9d960${_id}`
    }
}