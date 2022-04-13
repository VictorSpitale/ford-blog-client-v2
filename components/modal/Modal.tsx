import React, {useRef} from 'react';
import {AnyFunction} from "../../shared/types/props.type";
import {useOnClickOutside} from "../../shared/hooks";
import styles from '../../styles/Modal.module.css'
import {className} from "../../shared/utils/class.utils";

type PropsType = {
    isShowing: boolean,
    hide: AnyFunction,
    title?: string,
    children: JSX.Element[] | JSX.Element,
    hasPrevious?: boolean,
    previous?: AnyFunction
}
const Modal = ({hasPrevious, previous, hide, isShowing, title, children}: PropsType) => {

    const ref = useRef<HTMLDivElement>(null);
    useOnClickOutside(ref, isShowing ? () => hide() : null);

    return (
        <>
            {isShowing &&
				<div className={styles.modalOverlay}>
					<div className={styles.modalWrapper}>
						<div className={className("w-64 md:w-1/2 lg:w-1/3", styles.modal)} ref={ref}>
							<div
								className={className(title ? "border-b-secondary-500 justify-between p-4" : "justify-end pr-2", styles.modalHeader)}>
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
							<div>{children}</div>
						</div>
					</div>
				</div>}
        </>
    );
};

export default Modal;