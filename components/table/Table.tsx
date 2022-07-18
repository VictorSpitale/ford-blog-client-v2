import React, {useEffect, useState} from 'react';
import {className} from "../../shared/utils/class.utils";
import Arrow from "../shared/icons/Arrow";
import {AnyFunction} from "../../shared/types/props.type";
import RenderIf from "../shared/RenderIf";
import Button, {ButtonsProps} from "../shared/Button";

type Key = {
    label: string;
    key: string;
    operation?: "count" | "date";
}

type Action = {
    label: string;
    onClick: AnyFunction;
    color: ButtonsProps["style"];
}

type PropsType = {
    keys: Key[];
    data: any[];
    sortable?: boolean;
    onOpen?: AnyFunction;
    actions?: Action[]
}

type SortType = {
    key: Key["key"];
    state: "asc" | "desc" | "default"
}

const Table = ({keys, data: defaultData, sortable, onOpen, actions}: PropsType) => {

    const [sortState, setSortState] = useState<SortType>({} as SortType);
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        setData(defaultData);
    }, [defaultData]);

    const sortData = (keyType: Key) => {
        let tempData = [...data];
        if (sortState.key === keyType.key && sortState.state === "desc") {
            setSortState({state: "default", key: keyType.key});
            return setData(defaultData);
        }
        tempData = tempData.sort(function (a, b) {
            if (sortState.key !== keyType.key || sortState.state === "default") {
                setSortState({key: keyType.key, state: "asc"});
                if (keyType.operation === "count") {
                    return a[keyType.key].length - b[keyType.key].length;
                }
                return ("" + a[keyType.key]).localeCompare(("" + b[keyType.key]));
            } else if (sortState.state === "asc") {
                setSortState({key: keyType.key, state: "desc"});
                if (keyType.operation === "count") {
                    return b[keyType.key].length - a[keyType.key].length;
                }
                return ("" + b[keyType.key]).localeCompare(("" + a[keyType.key]));
            }
            return 0;
        })
        setData(tempData);
    }

    return (
        <table className={"text-lg w-full border-collapse"}>
            <thead>
                <tr className={"bg-primary-400 select-none"}>
                    {keys.map((k, i) => {
                        return (
                            <th key={i} onClick={sortable ? () => sortData(k) : () => null}
                                className={className(
                                    "first:rounded-tl-lg p-3 text-left text-white",
                                    sortable ? "cursor-pointer" : "",
                                    actions ? "" : "last:rounded-tr-lg")}>
                                {sortable && sortState.key === k.key && sortState.state !== "default" ?
                                    <div className={"text-white flex gap-x-2 items-center"}>
                                        {k.label}
                                        {<Arrow color={"white"}
                                                direction={sortState.state === "asc" ? "down" : "up"} />}
                                    </div>
                                    : <>{k.label}</>
                                }
                            </th>
                        )
                    })}
                    <RenderIf condition={!!actions}>
                        <th className={"rounded-tr-lg p-3 text-left text-white w-0"}>
                            Actions
                        </th>
                    </RenderIf>
                </tr>
            </thead>
            <tbody>
                {data.map((item, i) => {
                    return (
                        <tr key={i}
                            className={"transition-colors ease-out even:bg-primary-100 odd:bg-zinc-100"}>
                            {keys.map((k, j) => {
                                return (
                                    <td key={j} onClick={onOpen ? () => onOpen(item) : () => null}
                                        className={"border border-l-0 border-r-0 border-[#d8d8d8] p-3 text-left hover:cursor-pointer"}>
                                        <RenderIf condition={!k.operation}>
                                            {item[k.key]}
                                        </RenderIf>
                                        <RenderIf condition={k.operation === "count"}>
                                            {item[k.key].length}
                                        </RenderIf>
                                        <RenderIf condition={k.operation === "date"}>
                                            {new Date(item[k.key]).toLocaleDateString()}
                                        </RenderIf>
                                    </td>
                                )
                            })}
                            {actions &&
								<td
									key={i}
									className={"border border-l-0 border-r-0 border-[#d8d8d8] p-3 text-left"}>
									<div className={"flex gap-x-2"}>
                                        {actions.map((action, i) => {
                                            return (
                                                <Button key={i} onClick={() => action.onClick(item)} text={action.label}
                                                        element={"button"} style={action.color} />
                                            )
                                        })}
									</div>
								</td>
                            }
                        </tr>
                    )
                })}
            </tbody>
        </table>
    );
};

export default Table;