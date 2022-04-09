import React from 'react';
import {AnyFunction} from "../../../shared/types/props.type";
import styles from '/styles/LikeBtn.module.css'
import {className} from "../../../shared/utils/class.utils";

type PropsType = {
    isLiked: boolean;
    onClick: AnyFunction
}

const Heart = ({isLiked, onClick}: PropsType) => {
    return (
        <>
            <span className={styles.box} onClick={onClick} />
            <div className={className(styles.heart, isLiked ? styles.active : '')} />
        </>
    );
};

export default Heart;