import {render, screen} from "@testing-library/react";
import LoadingScreen from "../../../components/LoadingScreen";
import {queryByContent} from "../../utils/CustomQueries";
import styles from "../../../styles/Loading.module.css";

describe('LoadingScreenTest', function () {
    it('should render the loading screen', function () {

        render(
            <LoadingScreen isLoading={true} alreadyLoaded={false} />
        )

        expect(screen.getByAltText("background")).toBeInTheDocument();
        expect(screen.getByAltText("background during loading")).toBeInTheDocument();
        expect(screen.getByAltText("Ford Universe")).toBeInTheDocument();
        expect(screen.getByAltText("Ford Universe Logo")).toBeInTheDocument();

        expect(queryByContent("loading-screen")).toBeInTheDocument();
        expect(queryByContent("loading-screen")).not.toHaveClass(styles.page_container_loaded);
        expect(queryByContent("after-loading-content")).toBeInTheDocument();
        expect(queryByContent("after-loading-content")).not.toHaveClass(styles.content_container_loaded);

        expect(screen.getByAltText("Ford Universe")).not.toHaveClass(styles.fu_loaded);
        expect(screen.getByAltText("Ford Universe Logo")).not.toHaveClass(styles.loaded_2);

        expect(screen.getByAltText("background during loading")).not.toHaveClass(styles.group_loaded);

    });

    it('should render the loading screen already loaded', function () {

        render(
            <LoadingScreen isLoading={false} alreadyLoaded={true} />
        )

        expect(queryByContent("loading-screen")).toHaveClass(styles.page_container_loaded);
        expect(queryByContent("after-loading-content")).toHaveClass(styles.content_container_loaded);

        expect(screen.getByAltText("Ford Universe")).toHaveClass(styles.fu_loaded);
        expect(screen.getByAltText("Ford Universe Logo")).toHaveClass(styles.loaded_2);

        expect(screen.getByAltText("background during loading")).toHaveClass(styles.group_loaded);

    });

});