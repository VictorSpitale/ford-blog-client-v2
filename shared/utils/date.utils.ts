export const stringToDate = (num: string | number): Date => {
    let timestamp;
    if (typeof num === "string") {
        timestamp = Date.parse(num);
    } else {
        timestamp = num;
    }

    return new Date(timestamp);
};
export const timeSince = (date: Date | string): string => {

    if (typeof date === "string") date = stringToDate(date)

    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;

    if (interval > 1) {
        return `Il y a  ${Math.floor(interval)}  années`;
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return `Il y a  ${Math.floor(interval)}  mois`;
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return `Il y a  ${Math.floor(interval)}  jours`;
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return `Il y a  ${Math.floor(interval)}  heures`;
    }
    interval = seconds / 60;
    if (interval > 1) {
        return `Il y a  ${Math.floor(interval)}  minutes`;
    }
    return `Il y a  ${Math.floor(seconds)}  secondes`;
}