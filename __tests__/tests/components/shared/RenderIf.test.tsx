import {render} from "@testing-library/react";
import RenderIf from "../../../../components/shared/RenderIf";
import {queryByContent} from "../../../utils/CustomQueries";

describe('RenderIfTest', function () {

    it('should render the content', function () {

        render(
            <RenderIf condition={true}>
                <p data-content={"content"}>content</p>
            </RenderIf>
        )

        expect(queryByContent("content")).toBeInTheDocument();

    });

    it('should not render the content', function () {

        render(
            <RenderIf condition={false}>
                <p data-content={"content"}>content</p>
            </RenderIf>
        )

        expect(queryByContent("content")).not.toBeDefined();

    });

});