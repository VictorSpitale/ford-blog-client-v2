import React from 'react';
import {Children} from "../../shared/types/props.type";
import styles from '../../styles/Delimiter.module.css'

const Delimiter = ({children}: { children: Children }) => {
    return (
        <div className={styles.delimiter}>
            {children}
        </div>
    );
};

export default Delimiter;