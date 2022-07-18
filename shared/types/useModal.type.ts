export type UseModalType = {
    isShowing: boolean;
    toggle: () => void;
    otherModal: JSX.Element | undefined;
    addOtherModal: (el: JSX.Element) => void;
    previous: () => void;
    hasPrevious: boolean;
}