export const validateEmail = (email: string): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const isValidUrl = (url: string): boolean => {
    const urlPattern = new RegExp('^https:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$');
    return urlPattern.exec(url) !== null;
}

export const isUuid = (uuid: string): boolean => {
    const uuidRegex = new RegExp(/^[\w]{8}(-[\w]{4}){3}-[\w]{12}$/gm)
    return uuidRegex.exec(uuid) !== null;
}