import React from 'react';
import fu from "../public/static/img/FORD _UNIVERSE.svg";
import car from "../public/static/img/car_logo.svg";
import styles from '../styles/Header.module.css'

const Header = () => {
    return (
        <>
            <div className={styles.logo_container}>
                <img src={car.src} alt="Ford Universe Logo" />
                <img className={styles.fu_logo} src={fu.src} alt="Ford Universe" />
            </div>
        </>
    );
};

export default Header;