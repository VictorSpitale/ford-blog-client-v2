import CategoryInput from "../../../../components/categories/CategoryInput";
import {render, screen} from "@testing-library/react";
import {CategoryStub} from "../../../stub/CategoryStub";

describe('Category Input', function () {

    it('should render the input', function () {

        const category = CategoryStub();

        render(
            <CategoryInput category={category} />
        )
        expect(screen.getByText(category.name)).toBeInTheDocument();

    });

    it('should render the more', function () {


        render(
            <CategoryInput more={3} />
        )
        expect(screen.getByText(/\+ 3/)).toBeInTheDocument();

    });


});
