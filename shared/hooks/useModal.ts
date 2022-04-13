import {useState} from "react";
import {isEmpty} from "../utils/object.utils";

export const useModal = () => {
    const [isShowing, setIsShowing] = useState(false);
    const [otherModal, setOtherModal] = useState<JSX.Element | undefined>(undefined);
    const [history, setHistory] = useState<JSX.Element[]>([]);

    const toggle = () => {
        if (isShowing) {
            setOtherModal(undefined);
            setHistory([]);
        }
        setIsShowing(!isShowing);
    }

    const addOtherModal = (element: JSX.Element) => {
        setOtherModal(element);
        history.push(element);
    }

    const previous = () => {
        if (isEmpty(history)) return;
        if (!hasPrevious()) return;
        if (history.length === 1) {
            setOtherModal(undefined);
            setHistory([]);
        } else {
            setHistory(history.slice(0, history.length - 1));
            setOtherModal(history[history.length - 2]);
        }
    }

    const hasPrevious = (): boolean => {
        return !isEmpty(history);
    }

    return {
        isShowing,
        toggle,
        otherModal,
        addOtherModal,
        previous,
        hasPrevious
    };
};