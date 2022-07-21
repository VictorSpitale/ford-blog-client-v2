export type ICategory = {
    _id: string,
    name: string,
}

export type ICategoryWithCount = ICategory & {
    count: number;
}

export type UpdateCategory = Pick<ICategory, "name">;