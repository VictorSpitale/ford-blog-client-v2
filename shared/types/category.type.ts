export type ICategory = {
    _id: string,
    name: string,
}

export type ICategoryWithCount = ICategory & {
    count: number;
}