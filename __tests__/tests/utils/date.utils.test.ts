import {getTimeSinceMsg, stringToDate, timeSince} from "../../../shared/utils/date.utils";
import * as fr from "../../../public/static/locales/fr.json";
import * as en from "../../../public/static/locales/en.json";

describe('Date Utils', function () {

    describe('String to Date', function () {

        const stringDate = "2021-12-15T08:43:39.489Z";
        const millis = 1651394994520;

        it('should return a date object with a valid string date', () => {
            const date = stringToDate(stringDate)
            expect(date).toBeInstanceOf(Date);
            expect(date.getDate()).toBe(15);
        })

        it('should return the current date if value is invalid', () => {
            expect(stringToDate("invalid").setHours(0, 0, 0, 0)).toEqual(new Date().setHours(0, 0, 0, 0));
        })

        it('should return the date from millis', () => {
            expect(stringToDate(millis).getTime()).toEqual(millis);
        })

        it('should return the current date if millis format is invalid', () => {
            expect(stringToDate(88520).setHours(0, 0, 0, 0)).toEqual(new Date().setHours(0, 0, 0, 0));
        })

    });

    describe('Time Since', function () {

        // const mockMillis = 1651395474952; // 01/05/2022  10:57:54
        jest.spyOn(Date, 'now').mockImplementation(() => 1651395474952)
        // beforeAll(() => {
        //     jest.useFakeTimers();
        //     jest.setSystemTime(mockMillis);
        // })
        // afterAll(() => {
        //     jest.setSystemTime(jest.getRealSystemTime());
        //     jest.useRealTimers();
        // })

        it('should return 1 year', () => {
            expect(timeSince(new Date(2021, 4, 1))).toMatchObject({
                time: 1,
                format: 'years'
            })
        })

        it('should return 1 month', () => {
            expect(timeSince(new Date(2022, 3, 1))).toMatchObject({
                time: 1,
                format: 'months'
            })
        })

        it('should return 1 day', () => {
            expect(timeSince(new Date(2022, 3, 30))).toMatchObject({
                time: 1,
                format: 'days'
            })
        })

        it('should return 1 hour', () => {
            expect(timeSince(new Date(2022, 4, 1, 9, 57, 54))).toMatchObject({
                time: 1,
                format: 'hours'
            })
        })

        it('should return 1 minute', () => {
            expect(timeSince(new Date(2022, 4, 1, 10, 56, 54))).toMatchObject({
                time: 1,
                format: 'minutes'
            })
        })

        it('should return 1 second', () => {
            expect(timeSince(new Date(2022, 4, 1, 10, 57, 53))).toMatchObject({
                time: 1,
                format: 'seconds'
            })
        })
    });

    describe('Time Since Message', function () {
        // const mockMillis = 1651395474952; // 01/05/2022  10:57:54
        jest.spyOn(Date, 'now').mockImplementation(() => 1651395474952)

        // beforeAll(() => {
        //     jest.useFakeTimers();
        //     jest.setSystemTime(mockMillis);
        // })
        // afterAll(() => {
        //     jest.setSystemTime(jest.getRealSystemTime());
        //     jest.useRealTimers();
        // })

        it('should return a singular french formatted message', () => {
            const timeSinceObj = timeSince(new Date(2022, 4, 1, 10, 56, 54));
            expect(getTimeSinceMsg(fr, timeSinceObj)).toBe("Il y a 1 minute")
        })

        it('should return a plural french formatted message', () => {
            const timeSinceObj = timeSince(new Date(2022, 4, 1, 10, 55, 54));
            expect(getTimeSinceMsg(fr, timeSinceObj)).toBe("Il y a 2 minutes")
        })

        it('should match a singular french formatted message', () => {
            const timeSinceObj = timeSince(new Date(2022, 4, 1, 10, 56, 54));
            expect(getTimeSinceMsg(fr, timeSinceObj)).toMatch(/^Il y a [0-9] minute$/)
        })
        it('should match a plural french formatted message', () => {
            const timeSinceObj = timeSince(new Date(2022, 4, 1, 10, 55, 54));
            expect(getTimeSinceMsg(fr, timeSinceObj)).toMatch(/^Il y a [0-9] minutes$/)
        })

        it('should return a singular en formatted message', () => {
            const timeSinceObj = timeSince(new Date(2022, 4, 1, 10, 56, 54));
            expect(getTimeSinceMsg(en, timeSinceObj)).toBe("1 minute ago")
        })

        it('should return a plural en formatted message', () => {
            const timeSinceObj = timeSince(new Date(2022, 4, 1, 10, 55, 54));
            expect(getTimeSinceMsg(en, timeSinceObj)).toBe("2 minutes ago")
        })

        it('should match a singular en formatted message', () => {
            const timeSinceObj = timeSince(new Date(2022, 4, 1, 10, 56, 54));
            expect(getTimeSinceMsg(en, timeSinceObj)).toMatch(/^[0-9] minute ago$/)
        })
        it('should match a plural en formatted message', () => {
            const timeSinceObj = timeSince(new Date(2022, 4, 1, 10, 55, 54));
            expect(getTimeSinceMsg(en, timeSinceObj)).toMatch(/^[0-9] minutes ago$/)
        })
    });

});