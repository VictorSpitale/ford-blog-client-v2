import {RefObject, useEffect} from "react";
import {AnyFunction} from "../types/props.type";

export const useOnClickOutside = (ref: RefObject<HTMLElement>, handler: AnyFunction | null) => {
    useEffect(() => {
        const listener = (e: Event) => {
            const target = e.target as HTMLElement;
            if (!target) return;
            if (!ref.current || ref.current.contains(target)) return;
            if (handler) handler(e);
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};