export const isEmpty = (value: object | string) => {
    return (
        value === undefined ||
        value === null ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0)
    );
};

export const toFormData = (object: Record<string, string | Blob | string[]>): FormData => {
    const formData = new FormData();
    if (isEmpty(object)) return formData;
    Object.keys(object).forEach(key => {
        if (typeof object[key] === "string" || object[key] instanceof Blob) {
            const value = object[key] as string | Blob;
            formData.append(key, value);
        } else {
            const values = object[key] as string[];
            values.forEach((value) => {
                formData.append(key, value);
            })
        }
    });
    return formData;
}