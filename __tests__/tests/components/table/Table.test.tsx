import {MockUseRouter} from "../../../utils/MockUseRouter";
import {fireEvent, render, screen} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import Table from "../../../../components/table/Table";
import {queryByContent} from "../../../utils/CustomQueries";

describe('TableTest', function () {

    it('should render the table', function () {
        const router = MockUseRouter({});

        render(
            <RouterContext.Provider value={router}>
                <Table keys={[]} data={[]} />
            </RouterContext.Provider>
        )

        expect(queryByContent("table")).toBeInTheDocument();
        expect(queryByContent("actions")).not.toBeDefined();
        expect(queryByContent("keys-row").children.length).toBe(0);
        expect(queryByContent("table-content").children.length).toBe(0);
    });

    it('should render the table with datas and actions', function () {
        const router = MockUseRouter({});
        const fn = jest.fn();

        render(
            <RouterContext.Provider value={router}>
                <Table keys={[{key: "id", label: "ID"}]} data={[{id: 0}, {id: 1}]}
                       actions={[{label: "Supprimer", color: "danger", onClick: fn}]} />
            </RouterContext.Provider>
        )

        expect(queryByContent("table")).toBeInTheDocument();
        expect(queryByContent("actions")).toBeInTheDocument();
        expect(queryByContent("keys-row").children.length).toBe(2);
        expect(queryByContent("table-content").children.length).toBe(2);
        expect(screen.getByText("ID")).toBeInTheDocument();
        expect(screen.queryAllByText("Supprimer").length).toBe(2);
        fireEvent.click(screen.queryAllByText("Supprimer")[0]);
        expect(fn).toHaveBeenCalledWith({id: 0});
    });

    it('should render the table and handle click on data', function () {
        const router = MockUseRouter({});
        const fn = jest.fn();

        render(
            <RouterContext.Provider value={router}>
                <Table keys={[{key: "id", label: "ID"}]} data={[{id: 0}, {id: 1}]} onOpen={fn} />
            </RouterContext.Provider>
        )

        fireEvent.click(queryByContent("row-0-col-0"));
        expect(fn).toHaveBeenCalledWith({id: 0})
    });

    it('should render the table and sort the data', function () {
        const router = MockUseRouter({});

        render(
            <RouterContext.Provider value={router}>
                <Table keys={
                    [
                        {key: "id", label: "ID"},
                        {key: "name", label: "Nom"},
                        {key: "list", label: "List", operation: "count"}
                    ]} data={
                    [
                        {id: 0, name: "aaa", list: [1, 1, 1]},
                        {id: 1, name: "bbb", list: [1, 1, 1, 1]}
                    ]} sortable={true} />
            </RouterContext.Provider>
        )

        const idKey = queryByContent("keys-row").children[0];
        const nameKey = queryByContent("keys-row").children[1];
        const listKey = queryByContent("keys-row").children[2];

        expect(queryByContent("row-0-col-0").textContent).toBe("0")
        expect(queryByContent("row-1-col-0").textContent).toBe("1")

        expect(queryByContent("row-0-col-1").textContent).toBe("aaa")
        expect(queryByContent("row-1-col-1").textContent).toBe("bbb")

        expect(queryByContent("row-0-col-2").textContent).toBe("3")
        expect(queryByContent("row-1-col-2").textContent).toBe("4")

        fireEvent.click(idKey);
        // Default => asc
        expect(queryByContent("row-0-col-0").textContent).toBe("0")
        expect(queryByContent("row-1-col-0").textContent).toBe("1")
        expect(queryByContent("arrow-down")).toBeInTheDocument();

        fireEvent.click(idKey);
        // asc => desc
        expect(queryByContent("row-0-col-0").textContent).toBe("1")
        expect(queryByContent("row-1-col-0").textContent).toBe("0")
        expect(queryByContent("arrow-up")).toBeInTheDocument();

        fireEvent.click(idKey);
        // desc => default
        expect(queryByContent("row-0-col-0").textContent).toBe("0")
        expect(queryByContent("row-1-col-0").textContent).toBe("1")
        expect(queryByContent("arrow-down")).not.toBeDefined();
        expect(queryByContent("arrow-up")).not.toBeDefined();

        fireEvent.click(nameKey);
        // Default => asc
        expect(queryByContent("row-0-col-1").textContent).toBe("aaa")
        expect(queryByContent("row-1-col-1").textContent).toBe("bbb")
        expect(queryByContent("arrow-down")).toBeInTheDocument();

        fireEvent.click(nameKey);
        // asc => desc
        expect(queryByContent("row-0-col-1").textContent).toBe("bbb")
        expect(queryByContent("row-1-col-1").textContent).toBe("aaa")
        expect(queryByContent("arrow-up")).toBeInTheDocument();

        fireEvent.click(nameKey);
        // desc => default
        expect(queryByContent("row-0-col-1").textContent).toBe("aaa")
        expect(queryByContent("row-1-col-1").textContent).toBe("bbb")
        expect(queryByContent("arrow-down")).not.toBeDefined();
        expect(queryByContent("arrow-up")).not.toBeDefined();

        fireEvent.click(listKey);
        // Default => asc
        expect(queryByContent("row-0-col-2").textContent).toBe("3")
        expect(queryByContent("row-1-col-2").textContent).toBe("4")
        expect(queryByContent("arrow-down")).toBeInTheDocument();

        fireEvent.click(listKey);
        // asc => desc
        expect(queryByContent("row-0-col-2").textContent).toBe("4")
        expect(queryByContent("row-1-col-2").textContent).toBe("3")
        expect(queryByContent("arrow-up")).toBeInTheDocument();

        fireEvent.click(listKey);
        // desc => default
        expect(queryByContent("row-0-col-2").textContent).toBe("3")
        expect(queryByContent("row-1-col-2").textContent).toBe("4")
        expect(queryByContent("arrow-down")).not.toBeDefined();
        expect(queryByContent("arrow-up")).not.toBeDefined();

    });

});