import {act, render} from "@testing-library/react";
import {TestHook} from "../../utils/TestHook";
import {useModal} from "../../../shared/hooks";
import {UseModalType} from "../../../shared/types/useModal.type";
import React from "react";

describe('Use Modal', function () {

    let modal: UseModalType;

    beforeEach(() => {
        render(
            <TestHook callback={() => {
                modal = useModal();
            }} />
        )
    })

    it('should have the use modal properties', () => {
        expect(modal).toBeDefined();
        expect(modal.toggle).toBeInstanceOf(Function);
        expect(typeof modal.isShowing).toBe("boolean");
        expect(modal.otherModal).not.toBeDefined();
        expect(modal.addOtherModal).toBeInstanceOf(Function);
        expect(modal.previous).toBeInstanceOf(Function);
        expect(typeof modal.hasPrevious).toBe("boolean");
    })

    it('should toggle the modal', () => {
        expect(modal.isShowing).toBe(false);
        act(() => {
            modal.toggle();
        })
        expect(modal.isShowing).toBe(true);
    })

    it('should clear the modal history on close', () => {
        expect(modal.otherModal).not.toBeDefined();
        act(() => {
            modal.addOtherModal(<></>);
        })
        expect(modal.hasPrevious).toBe(true);
        expect(React.isValidElement(modal.otherModal)).toBe(true);
        act(() => {
            modal.toggle(); // Open
        })
        act(() => {
            modal.toggle(); // Close
        })
        expect(modal.otherModal).not.toBeDefined();
        expect(modal.hasPrevious).toBe(false);
    })

    it('should not navigate through elements if the history is empty', () => {
        expect(modal.otherModal).not.toBeDefined();
        act(() => modal.previous());
        expect(modal.otherModal).not.toBeDefined();
    })

    it('should clear the history if the previous element is the last one', () => {
        const last = <h1>last</h1>;
        act(() => modal.addOtherModal(last))
        expect(modal.otherModal).toBe(last);
        act(() => modal.previous());
        expect(modal.otherModal).not.toBeDefined();
        expect(modal.hasPrevious).toBe(false);
    })

    it('should navigate through elements', () => {
        const last = <h1>last</h1>;
        const current = <h1>current</h1>;
        act(() => modal.addOtherModal(last))
        act(() => modal.addOtherModal(current))
        expect(modal.otherModal).toBe(current);
        expect(modal.hasPrevious).toBe(true);
        act(() => modal.previous());
        expect(modal.hasPrevious).toBe(true);
        expect(modal.otherModal).toBe(last);
    })

});