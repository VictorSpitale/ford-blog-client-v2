import React, {ForwardedRef, forwardRef, useRef} from 'react';
import {AnyFunction} from "../../shared/types/props.type";
import {useOnClickOutside} from "../../shared/hooks";
import styles from '../../styles/Modal.module.css'
import {className} from "../../shared/utils/class.utils";
import {mergeRefs} from "../../shared/utils/refs.utils";

type PropsType = {
    isShowing: boolean,
    hide: AnyFunction,
    title?: string,
    children: JSX.Element[] | JSX.Element,
    hasPrevious?: boolean,
    previous?: AnyFunction,
    large?: boolean
}
const Modal = forwardRef(({
                              hasPrevious,
                              previous,
                              hide,
                              isShowing,
                              title,
                              children,
                              large = false
                          }: PropsType, modalRef: ForwardedRef<HTMLDivElement>) => {

    const ref = useRef<HTMLDivElement>(null);
    useOnClickOutside(ref, isShowing ? () => hide() : null);

    return (
        <>
            {isShowing &&
				<div className={styles.modalOverlay}>
					<div className={styles.modalWrapper}>
						<div className={
                            className(large ? "w-3/4" : "w-64 md:w-1/2 lg:w-1/3", "c-scroll",
                                styles.modal)} ref={mergeRefs(ref, modalRef)}>
							<div
								className={className(title ? "border-b border-b-secondary-500 justify-between p-4" : "justify-end pr-[11px]", styles.modalHeader)}>
                                {title && <h4 className={"text-xl md:text-2xl"}>{hasPrevious && previous &&
									<button type={"button"} className={styles.modalButton} onClick={() => previous()}>
										<span>&larr;</span>
									</button>} {title}</h4>}
								<button
									type="button"
									className={className("ml-2", styles.modalButton)}
									onClick={() => hide()}
								>&times;</button>
							</div>
							<>{children}</>
						</div>
					</div>
				</div>}
        </>
    );
});
Modal.displayName = "Modal"
export default Modal;