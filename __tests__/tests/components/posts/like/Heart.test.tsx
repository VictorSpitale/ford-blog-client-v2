import {fireEvent, render} from "@testing-library/react";
import Heart from "../../../../../components/posts/like/Heart";
import {queryByContent} from "../../../../utils/CustomQueries";

describe('Heart', function () {

    it('should render the default heart icon', () => {
        const fn = jest.fn();
        render(
            <Heart isLiked={false} onClick={fn} />
        )
        expect(queryByContent('heart-box')).toBeInTheDocument();
        expect(queryByContent('heart-icon')).toBeInTheDocument();
        expect(queryByContent("heart-icon").className).toBe("heart");
    })

    it('should change the icon on click (like)', () => {
        let isLiked = false;
        const fn = jest.fn(() => isLiked = !isLiked);

        const {rerender} = render(
            <Heart isLiked={isLiked} onClick={fn} />
        )

        expect(isLiked).toBe(false);
        expect(fn).not.toHaveBeenCalled();
        fireEvent.click(queryByContent('heart-box'));
        expect(isLiked).toBe(true);
        expect(fn).toHaveBeenCalled();

        rerender(
            <Heart isLiked={isLiked} onClick={fn} />
        )

        expect(queryByContent('heart-icon').className).toEqual("heart active")
    })

    it('should change the icon on click (unlike)', () => {
        let isLiked = true;
        const fn = jest.fn(() => isLiked = !isLiked);

        const {rerender} = render(
            <Heart isLiked={isLiked} onClick={fn} />
        )
        expect(isLiked).toBe(true);
        expect(fn).not.toHaveBeenCalled();
        fireEvent.click(queryByContent('heart-box'));
        expect(isLiked).toBe(false);
        expect(fn).toHaveBeenCalled();

        rerender(
            <Heart isLiked={isLiked} onClick={fn} />
        )

        expect(queryByContent('heart-icon').className).toEqual("heart")
    })
});