import {render, screen} from "@testing-library/react";
import Button from "../../../../components/shared/Button";

describe('ButtonTest', function () {

    it('should render a button', function () {

        render(
            <Button text={"Button"} element={"button"} />
        )

        expect(screen.getByText("Button")).toBeInTheDocument();
        expect(screen.getByText("Button").tagName).toBe("BUTTON");
    });

    it('should render a link', function () {

        render(
            <Button text={"Button"} element={"link"} onClick={"/route"} />
        )

        expect(screen.getByText("Button")).toBeInTheDocument();
        expect(screen.getByText("Button").tagName).toBe("A");
    });


    it('should render a button with custom classes', function () {

        render(
            <Button text={"Button"} element={"button"} classes={"c-classes"} />
        )

        expect(screen.getByText("Button")).toHaveClass('c-classes');
    });


});