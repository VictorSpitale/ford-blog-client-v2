import {AnyFunction} from "../../shared/types/props.type";

export const TestHook = ({callback}: { callback: AnyFunction }) => {
    callback();
    return null;
}