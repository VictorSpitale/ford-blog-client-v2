import {fireEvent, render, screen} from "@testing-library/react";
import {useRef} from "react";
import {useOnClickOutside} from "../../../shared/hooks";
import {AnyFunction} from "../../../shared/types/props.type";

const TestHook = ({handler}: { handler: AnyFunction }) => {

    const ref = useRef<HTMLDivElement>(null);
    useOnClickOutside(ref, handler);
    return (<div>
        <h1>Outside</h1>
        <div ref={ref}>Content</div>
    </div>)
}

describe('Use Click Outside', function () {

    it('should trigger the handler', () => {
        const fn = jest.fn();
        render(<TestHook handler={fn} />)
        const h1 = screen.getByText('Outside')
        fireEvent.mouseDown(h1);
        expect(fn).toHaveBeenCalled();
    })

    it('should not trigger the handler', () => {
        const fn = jest.fn();
        render(<TestHook handler={fn} />)
        const content = screen.getByText('Content')
        fireEvent.mouseDown(content);
        expect(fn).not.toHaveBeenCalled();
    })

});