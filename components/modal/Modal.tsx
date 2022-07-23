import React, {ForwardedRef, forwardRef, memo, useRef} from 'react';
import {AnyFunction, Children} from "../../shared/types/props.type";
import {useOnClickOutside} from "../../shared/hooks";
import styles from '../../styles/Modal.module.css'
import {className} from "../../shared/utils/class.utils";
import {mergeRefs} from "../../shared/utils/refs.utils";

type PropsType = {
    isShowing: boolean,
    hide: AnyFunction,
    title?: string,
    children: Children,
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
				<div data-content={"overlay"} className={styles.modalOverlay}>
					<div className={styles.modalWrapper}>
						<div className={
                            className(large ? "w-3/4" : "w-72 md:w-1/2 lg:w-1/3", "c-scroll",
                                styles.modal)} ref={mergeRefs(ref, modalRef)} data-content={"modal"}>
							<div className={className(title ? "border-b border-b-secondary-500 justify-between p-4" :
                                "justify-end pr-[11px]", styles.modalHeader)} data-content={"modal-header"}>
                                {title && <h4 className={"text-xl md:text-2xl"}>{hasPrevious && previous &&
									<button
										className={styles.modalButton} onClick={() => previous()}
										data-content={"previous-modal"} type={"button"}>
										<span>&larr;</span>
									</button>} {title}</h4>}
								<button
									data-content={"modal-cross"}
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
export default memo(Modal);