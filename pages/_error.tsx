import React from 'react';
import SEO from "../components/shared/seo";
import Image from 'next/image'
import bg from '../public/static/img/error.jpg'
import blur from '../public/static/img/blur.png'
import {className} from "../shared/utils/class.utils";
import styles from "../styles/Error.module.css";
import {NextApiResponse} from "next";
import {useTranslation} from "../shared/hooks";
import Button from "../components/shared/Button";

function Error({statusCode, customMessage}: { statusCode: number, customMessage?: string }) {
    const t = useTranslation()
    return (
        <>
            <SEO title={t.common.error.replace('{{code}}', statusCode.toString())} shouldIndex={false} />
            <Image src={bg.src} layout={"fill"} objectFit={"cover"} placeholder={"blur"} blurDataURL={blur.src}
                   alt={"Background image"} />
            <div className={className(styles.errorContainer, "pr-[10px]")}>
                <h1 className={"text-white text-2xl md:text-4xl xl:text-8xl"}>{t.common.error.replace('{{code}}', statusCode.toString())}</h1>
                <p className={"text-white text-sm md:text-2xl xl:text-4xl"}>{customMessage ? customMessage : t.common.errorSub}</p>
                <br />
                <Button text={t.common.backHome} element={"link"} onClick={"/"} classes={"md:text-lg xl:text-2xl"} />
            </div>
        </>
    )
}

export async function getStaticProps({res, err}: { res: NextApiResponse, err: any }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return {
        props: {
            statusCode,
        }
    }
}

export default Error