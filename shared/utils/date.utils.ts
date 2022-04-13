import {Translation} from "../hooks/useTranslation";

export const stringToDate = (num: string | number): Date => {
    let timestamp;
    if (typeof num === "string") {
        timestamp = Date.parse(num);
    } else {
        timestamp = num;
    }

    return new Date(timestamp);
};
export const timeSince = (date: Date | string) => {

    if (typeof date === "string") date = stringToDate(date)

    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) {
        return {
            time: Math.floor(interval),
            format: "years"
        }
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return {
            time: Math.floor(interval),
            format: "months"
        }
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return {
            time: Math.floor(interval),
            format: "days"
        }
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return {
            time: Math.floor(interval),
            format: "hours"
        }
    }
    interval = seconds / 60;
    if (interval > 1) {
        return {
            time: Math.floor(interval),
            format: "minutes"
        }
    }
    return {
        time: Math.floor(interval),
        format: "seconds"
    }
}

export const getTimeSinceMsg = (t: Translation, timeSinceObj: { format: string, time: number }) => {
    const timeSince = t.posts.timeSince.replace('{{time}}', timeSinceObj.time.toString())
    const format = t.common.timeSince[timeSinceObj.format as never] as string;
    return timeSince.replace('{{format}}', format.replace('{{s}}', timeSinceObj.time > 1 ? "s" : ""))
}