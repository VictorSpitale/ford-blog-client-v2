import {useState} from "react";
import {isEmpty} from "../utils/object.utils";
import {UseModalType} from "../types/useModal.type";

export const useModal = (): UseModalType => {
    const [isShowing, setIsShowing] = useState(false);
    const [otherModal, setOtherModal] = useState<JSX.Element | undefined>(undefined);
    const [history, setHistory] = useState<JSX.Element[]>([]);

    const toggle = () => {
        setIsShowing(!isShowing);
        if (isShowing) {
            setOtherModal(undefined);
            setHistory([]);
        }
    }

    const addOtherModal = (element: JSX.Element) => {
        setOtherModal(element);
        history.push(element);
    }

    const previous = () => {
        if (!hasPrevious) return;
        if (history.length === 1) {
            setOtherModal(undefined);
            setHistory([]);
        } else {
            setHistory(history.slice(0, history.length - 1));
            setOtherModal(history[history.length - 2]);
        }
    }

    const hasPrevious = !isEmpty(history);

    return {
        isShowing,
        toggle,
        otherModal,
        addOtherModal,
        previous,
        hasPrevious
    };
};