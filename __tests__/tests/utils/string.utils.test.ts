import {capitalize, getFirstSentence, slugify} from "../../../shared/utils/string.utils";

describe('String utils', function () {

    describe('Capitalize', function () {
        const toCapitalize = "il était une fois...";
        const capitalized = "Il était une fois...";

        it('should capitalize a string', () => {
            expect(capitalize(toCapitalize)).toBe(capitalized);
        })

        it('should return empty string if value is null', () => {
            expect(capitalize(null as unknown as string)).toBe('');
        })
    });

    describe('First Sentence', function () {

        const text = "Il était une fois. Une chasseur";
        const altText = "Il était une fois"
        const firstSentence = "Il était une fois.";

        it('should get the first sentence of a text', () => {
            expect(getFirstSentence(text)).toBe(firstSentence);
        })

        it('should add a "." at the end of the sentence if the text does not contain one', () => {
            expect(getFirstSentence(altText)).toBe(`${altText}.`)
        })

        it('should return an empty string if the value is null', () => {
            expect(getFirstSentence(null as unknown as string)).toBe("");
        })
    });

    describe('Slugify', function () {

        const title = "La nouvelle mustang";
        const slug = "la-nouvelle-mustang";

        it('should slugify a sentence', () => {
            const slugged = slugify(title);
            expect(slugged).toBe(slug);
            expect(slugged === slugged.toLowerCase()).toBe(true);
            expect(slugged).not.toContain(" ");
        })

        it('should return empty string if the value is null', () => {
            expect(slugify(null as unknown as string)).toBe("");
        })

    });

});