export const capitalize = (value: string) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
};

export const getFirstSentence = (value: string): string => {
    return value.split('.')[0] + "."
}
