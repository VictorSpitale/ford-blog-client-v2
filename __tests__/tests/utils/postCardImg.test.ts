import {PostStub} from "../../stub/PostStub";
import {getPostCardImg} from "../../../shared/images/postCardImg";

const mockedImageSrc = '../../tests/stub/ford-f-100-eluminator-concept.jpg'
jest.mock('../../tests/stub/ford-f-100-eluminator-concept.jpg', () => ({
    src: "../../tests/stub/ford-f-100-eluminator-concept.jpg"
}));

describe('Post Card Image', function () {

    const post = PostStub();

    const OLD_ENV = process.env;
    beforeEach(() => {

        jest.resetModules();
        process.env = {...OLD_ENV};
    })

    afterAll(() => {
        process.env = OLD_ENV;
    })

    it('should return the dev image src', () => {
        process.env.NEXT_PUBLIC_ENV = "development";
        expect(getPostCardImg(post)).toBe(mockedImageSrc);
    })

    it('should return the prod image src', () => {
        process.env.NEXT_PUBLIC_ENV = "production";
        expect(getPostCardImg(post)).toBe(post.picture);
    })

});