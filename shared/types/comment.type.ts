export type IComment = {
    _id: string;
    commenter: {
        _id: string;
        pseudo: string;
        picture?: string;
    };
    comment: string;
    createdAt: number;
    updatedAt?: number;
};