import {ReactChild, ReactFragment, ReactPortal} from "react";

export type Children = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined;
export type AnyFunction = (...args: any[]) => any