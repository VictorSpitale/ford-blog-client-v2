export const capitalize = (value: string) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
};

export const getFirstSentence = (value: string): string => {
    return value.split('.')[0] + "."
}

export const slugify = (text: string) => {
    return text
        .toString()                                        // Cast to string
        .toLowerCase()                                    // Convert the string to lowercase letters
        .normalize('NFD')                           // The normalize() method returns the Unicode Normalization Field of a given string.
        .trim()                                         // Remove whitespace from both sides of a string
        .replace(/\s+/g, '-')      // Replace spaces with -
        .replace(/[^\w-]+/g, '')  // Remove all non-word chars
        .replace(/--+/g, '-');   // Replace multiple - with single -
};