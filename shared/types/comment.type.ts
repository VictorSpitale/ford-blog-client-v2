export type IComment = {
    _id: string;
    commenter: {
        pseudo: string;
        picture?: string;
    };
    comment: string;
    createdAt: string;
    updatedAt: string;
};