import {makeStore} from "../../../../context/store";
import {MockUseRouter} from "../../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import Modal from "../../../../components/modal/Modal";
import {queryByContent} from "../../../utils/CustomQueries";

describe('ModalTest', function () {
    it('should render the modal without title', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Modal isShowing={true} hide={jest.fn()}>
                        <p data-content={"content"}>content</p>
                    </Modal>
                </RouterContext.Provider>
            </Provider>
        )

        expect(queryByContent("overlay")).toBeInTheDocument();
        expect(queryByContent("modal")).toBeInTheDocument();
        expect(queryByContent("modal")).toHaveClass("w-64")
        expect(queryByContent("content")).toBeInTheDocument();
        expect(queryByContent("modal-cross")).toBeInTheDocument();
        expect(queryByContent("modal-header")).toBeInTheDocument();
        expect(queryByContent("modal-header")).toHaveClass("justify-end");
    });

    it('should close the large modal with title', async function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const hide = jest.fn();
        const title = "Titre"

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <p data-content={"outside"}>outside</p>
                    <Modal isShowing={true} hide={hide} title={title} large={true}>
                        <p data-content={"content"}>content</p>
                    </Modal>
                </RouterContext.Provider>
            </Provider>
        )
        const cross = queryByContent("modal-cross");
        expect(queryByContent("modal-header")).toHaveClass("justify-between");
        expect(queryByContent("modal")).toHaveClass("w-3/4");

        expect(screen.getByText(title)).toBeInTheDocument();
        expect(cross).toBeInTheDocument();
        fireEvent.click(cross);
        expect(hide).toHaveBeenCalledTimes(1);

        const outside = queryByContent("outside");
        fireEvent(outside, new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
        }));
        await waitFor(() => {
            expect(hide).toHaveBeenCalledTimes(2);
        })

    });

    it('should render modal with previous modal', function () {
        const store = makeStore();
        const router = MockUseRouter({});
        const previous = jest.fn();

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Modal hasPrevious={true} previous={previous} isShowing={true} hide={jest.fn()} title={"titre"}>
                        <p>content</p>
                    </Modal>
                </RouterContext.Provider>
            </Provider>
        )

        const previousBtn = queryByContent("previous-modal");
        expect(previousBtn).toBeInTheDocument();

        fireEvent.click(previousBtn);
        expect(previous).toHaveBeenCalled();
    });

    it('should not render modal', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <Modal isShowing={false} hide={jest.fn()}>
                        <p>content</p>
                    </Modal>
                </RouterContext.Provider>
            </Provider>
        )

        expect(queryByContent("modal")).not.toBeDefined();

    });

});