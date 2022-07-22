import {fireEvent, render} from "@testing-library/react";
import Tabs from "../../../../components/tabs/Tabs";
import {queryByContent} from "../../../utils/CustomQueries";

describe('TabsTest', function () {

    it('should render the tabs with the first active then switch', function () {
        render(
            <Tabs>
                <div data-label="info">
                    <p data-content={"content"}></p>
                </div>
                <div data-label="autre">
                    <p data-content={"autre"}></p>
                </div>
            </Tabs>
        )

        expect(queryByContent("content")).toBeInTheDocument();
        expect(queryByContent("autre")).not.toBeDefined();

        fireEvent.click(queryByContent("tab-not-active"));

        expect(queryByContent("autre")).toBeInTheDocument();
        expect(queryByContent("content")).not.toBeDefined();


    });


});