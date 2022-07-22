import {render} from "@testing-library/react";
import Arrow from "../../../../components/shared/icons/Arrow";
import {queryByContent} from "../../../utils/CustomQueries";

describe('ArrowTest', function () {

    it('should render the default arrow', function () {
        render(
            <Arrow />
        )
        expect(queryByContent("arrow-down")).toBeInTheDocument();
    });

    it('should render the up arrow', function () {
        render(
            <Arrow direction={"up"} />
        )
        expect(queryByContent("arrow-up")).toBeInTheDocument();
    });

});