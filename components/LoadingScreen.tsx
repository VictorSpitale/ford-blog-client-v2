import React, {useEffect, useRef} from 'react';
import SEO from "./seo";
import styles from '../styles/Loading.module.css'
import group from '../public/static/img/SPLASH.svg'
import groupLoaded from '../public/static/img/SPLASH-2.svg'
import fu from '../public/static/img/FORD _UNIVERSE.svg'
import car from '../public/static/img/car_logo.svg'
import {className} from "../shared/utils/classUtils";
import {Children} from "../shared/types/props.types";

type PropsType = {
    isLoading: boolean,
    children?: Children
}

const LoadingScreen = ({isLoading, children}: PropsType) => {

    const logoRef = useRef<HTMLImageElement>(null)
    const groupRef = useRef<HTMLImageElement>(null)
    const pageRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const fuRef = useRef<HTMLImageElement>(null)

    useEffect(() => {
        logoRef.current?.addEventListener('animationiteration', () => {
            if (!isLoading) {
                logoRef.current?.classList.replace(styles.animate, styles.loaded)
                groupRef.current?.classList.add(styles.group_loaded)
                setTimeout(() => {
                    pageRef.current?.classList.add(styles.page_container_loaded)
                    logoRef.current?.classList.add(styles.loaded_2)
                    fuRef.current?.classList.add(styles.fu_loaded)
                    contentRef.current?.classList.add(styles.content_container_loaded)
                }, /*@TODO: Initial duration = --duration / 2 */ 100)
            }
        }, false)
    })

    return (
        <div ref={pageRef} className={styles.page_container}>
            <div className={styles.container}>
                <SEO title={'Chargement...'} />
                <div className={styles.group_container}>
                    <img src={groupLoaded.src} alt="" className={styles.group_2} />
                    <img ref={groupRef} src={group.src} alt="" className={styles.group} />
                </div>
                <div className={styles.logo_container}>
                    <img ref={fuRef} src={fu.src} alt="" className={styles.fu_logo} />
                </div>
                <img ref={logoRef} src={car.src} alt=""
                     className={className(styles.animate, styles.car_logo)} />
            </div>
            <div ref={contentRef} className={styles.content_container}>
                {children}
            </div>
        </div>
    );
};

export default LoadingScreen;