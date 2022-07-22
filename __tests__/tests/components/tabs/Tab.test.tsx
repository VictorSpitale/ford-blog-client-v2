import Tab from "../../../../components/tabs/Tab";
import {fireEvent, render} from "@testing-library/react";
import {queryByContent} from "../../../utils/CustomQueries";

describe('TabTest', function () {

    it('should render the active tab', function () {

        const fn = jest.fn();

        render(
            <Tab activeTab={"info"} label={"info"} onClick={fn} />
        )

        expect(queryByContent("tab-active")).toBeInTheDocument();
        fireEvent.click(queryByContent("tab-active"));
        expect(fn).toHaveBeenCalledWith("info");
    });

    it('should render the not active tab', function () {

        const fn = jest.fn();

        render(
            <Tab activeTab={"autre"} label={"info"} onClick={fn} />
        )

        expect(queryByContent("tab-not-active")).toBeInTheDocument();
        fireEvent.click(queryByContent("tab-not-active"));
        expect(fn).toHaveBeenCalledWith("info");
    });

});