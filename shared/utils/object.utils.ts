export const isEmpty = (value: object | string) => {
    return (
        value === undefined ||
        value === null ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0)
    );
};

export const mergeDeep = (target: any, source: any) => {
    const isObject = (obj: any) => obj && typeof obj === 'object';

    if (!isObject(target) || !isObject(source)) {
        return source;
    }

    Object.keys(source).forEach(key => {
        const targetValue = target[key];
        const sourceValue = source[key];

        if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
            target[key] = targetValue.concat(sourceValue);
        } else if (isObject(targetValue) && isObject(sourceValue)) {
            target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue);
        } else {
            target[key] = sourceValue;
        }
    });

    return target;
}

export const toFormData = (object: Record<string, string | Blob | string[]>): FormData => {
    const formData = new FormData();

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