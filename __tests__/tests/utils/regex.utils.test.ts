import {isUuid, isValidUrl, validateEmail} from "../../../shared/utils/regex.utils";

describe('Regex Utils', function () {

    describe('Validate Email', function () {
        const email = "vmairets@gmail.com";
        const wrong = "anything else then an email"

        it('should validate an email', () => {
            expect(validateEmail(email)).toBe(true);
        })

        it('should not validate a wrong email', () => {
            expect(validateEmail(wrong)).toBe(false);
        })

        it('should not validate a null value', () => {
            expect(validateEmail(null as unknown as string)).toBe(false);
        })

    });


    describe('Validate Url', function () {

        const url = "https://ford.fr";
        const wrong = "anything else then a valid url";
        const notHttpsUrl = "http://ford.fr";

        it('should validate a valid url', () => {
            expect(isValidUrl(url)).toBe(true);
        })

        it('should not validate a wrong url', () => {
            expect(isValidUrl(wrong)).toBe(false);
        })

        it('should not validate a url not in https', () => {
            expect(isValidUrl(notHttpsUrl)).toBe(false);
        })

        it('should not validate if the value is null', () => {
            expect(isValidUrl(null as unknown as string)).toBe(false);
        })

    });

    describe('Validate Uuid', function () {

        const uuid = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
        const wrong = "anything else then an uuid";

        it('should validate a valide uuid', () => {
            expect(isUuid(uuid)).toBe(true);
        })

        it('should not validate a wrong uuid', () => {
            expect(isUuid(wrong)).toBe(false);
        })

        it('should not validate if the value is null', () => {
            expect(isUuid(null as unknown as string)).toBe(false);
        })

    });

});