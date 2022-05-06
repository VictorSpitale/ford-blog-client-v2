import {isEmpty, toFormData} from "../../../shared/utils/object.utils";

describe('Object Utils', function () {

    describe('Is Empty', function () {

        it('should return true if object is null', () => {
            expect(isEmpty(null as unknown as object)).toBe(true);
        })

        it('should return true if object is undefined', () => {
            expect(isEmpty(undefined as unknown as object)).toBe(true);
        })

        it('should return true if object is empty', () => {
            expect(isEmpty({})).toBe(true);
        })

        it('should return true if string is empty', () => {
            expect(isEmpty("")).toBe(true);
        })

        it('should return true if string is blank', () => {
            expect(isEmpty("    ")).toBe(true);
        })

        it('should return false if string is not empty', () => {
            expect(isEmpty("coucou")).toBe(false);
        })

        it('should return false if object is not empty', () => {
            expect(isEmpty({
                title: "coucou"
            })).toBe(false);
        })

        it('should return true if value is not a valid object', () => {
            expect(isEmpty(new Date())).toBe(true);
        })

    });

    describe('To Form Data', function () {

        const object = {
            title: "salut",
            categories: ["sport", "mustang"]
        }

        it('should convert an object to a form data object', () => {
            const formData = toFormData(object);
            expect(formData).toBeInstanceOf(FormData);
            expect(formData.get("title")).toBe(object.title);
            expect(formData.getAll("categories")).toEqual(object.categories);
        })

        it("should return an empty form data if object is empty", () => {
            expect(toFormData(null as unknown as Record<string, string>).values()).toMatchObject({});
        })

    });

});