export const className = (...arr: string[]) => {
    return arr.filter(Boolean).join(' ');
};