import {className} from "../../../shared/utils/class.utils";

describe('Class Utils', function () {

    describe('Class Name', function () {

        it('should merge classes', () => {
            expect(className("one", "two")).toBe('one two');
        })

        it('should return an empty string if values are nulls', () => {
            expect(className()).toBe("");
        })

    });

});