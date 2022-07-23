import React, {useEffect, useState} from 'react';
import {className} from "../../shared/utils/class.utils";
import Arrow from "../shared/icons/Arrow";
import {AnyFunction} from "../../shared/types/props.type";
import RenderIf from "../shared/RenderIf";
import Button, {ButtonsProps} from "../shared/Button";
import {useTranslation} from "../../shared/hooks";

type Key = {
    label: string;
    key: string;
    operation?: "count" | "date";
    hideOnMobile?: boolean;
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

    const t = useTranslation();

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
            } else {
                setSortState({key: keyType.key, state: "desc"});
                if (keyType.operation === "count") {
                    return b[keyType.key].length - a[keyType.key].length;
                }
                return ("" + b[keyType.key]).localeCompare(("" + a[keyType.key]));
            }
        })
        setData(tempData);
    }

    return (
        <table data-content={"table"} className={"text-sm md:text-lg w-full border-collapse table-auto"}>
            <thead>
                <tr data-content={"keys-row"} className={"bg-primary-400 select-none"}>
                    {keys.map((k, i) => {
                        return (
                            <th key={i} onClick={sortable ? () => sortData(k) : undefined}
                                className={className(
                                    "first:rounded-tl-lg p-3",
                                    sortable ? "cursor-pointer" : "",
                                    actions ? "" : "last:rounded-tr-lg",
                                    k.hideOnMobile ? "hidden md:table-cell" : "")}>
                                {sortable && sortState.key === k.key && sortState.state !== "default" ?
                                    <div className={"flex gap-x-2 items-center"}>
                                        <h1 className={"text-white text-left text-sm md:text-lg"}>{k.label}</h1>
                                        {<Arrow color={"white"}
                                                direction={sortState.state === "asc" ? "down" : "up"} />}
                                    </div>
                                    :
                                    <h1 className={"text-white text-left text-sm md:text-lg"}>{k.label}</h1>
                                }
                            </th>
                        )
                    })}
                    <RenderIf condition={!!actions}>
                        <th data-content={"actions"} className={"rounded-tr-lg p-3  w-0"}>
                            <h1 className={"text-left text-white text-sm md:text-lg"}>{t.tabs.actions}</h1>
                        </th>
                    </RenderIf>
                </tr>
            </thead>
            <tbody data-content={"table-content"}>
                {data.map((item, i) => {
                    return (
                        <tr key={i}
                            className={"transition-colors ease-out even:bg-primary-100 odd:bg-zinc-100"}>
                            {keys.map((k, j) => {
                                return (
                                    <td data-content={`row-${i}-col-${j}`} key={j}
                                        onClick={onOpen ? () => onOpen(item) : undefined}
                                        className={className(
                                            "first:break-words first:line-clamp-1 leading-[3] w-fit first:w-full",
                                            "p-3 text-left hover:cursor-pointer",
                                            k.hideOnMobile ? "hidden md:table-cell" : "")}>
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
									className={"p-3 text-left"}>
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