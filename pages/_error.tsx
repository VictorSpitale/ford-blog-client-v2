import React from 'react';
import SEO from "../components/shared/seo";
import {useTranslation} from "next-i18next";
import Image from 'next/image'
import bg from '../public/static/img/error.jpg'
import blur from '../public/static/img/blur.png'
import Link from 'next/link'
import {className} from "../shared/utils/class.utils";
import styles from "../styles/Error.module.css";
import {NextApiResponse} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

function Error({statusCode}: { statusCode: number }) {
    const {t} = useTranslation('common')
    return (
        <>
            <SEO title={t('error', {code: statusCode})} shouldIndex={false} />
            <Image src={bg.src} layout={"fill"} objectFit={"cover"} placeholder={"blur"} blurDataURL={blur.src}
                   alt={"Background image"} />
            <div className={className(styles.errorContainer, "pr-[10px]")}>
                <h1 className={"text-white text-2xl md:text-4xl xl:text-8xl"}>{t('error', {code: statusCode})}</h1>
                <p className={"text-white text-sm md:text-2xl xl:text-4xl"}>{t('errorSub')}</p>
                <br />
                <Link href={"/"} passHref>
                    <a className={"px-2 py-1 shadow-primary-300/40 hover:shadow-primary-300/60 rounded bg-primary-400" +
                        " hover:bg-primary-500 shadow-2xl underline text-white text-xs md:text-lg xl:text-2xl"}>
                        {t('backHome')}</a>
                </Link>
            </div>
        </>
    )
}

export async function getStaticProps({res, err, locale}: { res: NextApiResponse, err: any, locale: string }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return {
        props: {
            statusCode,
            ...await serverSideTranslations(locale as string, ['common'])
        }
    }
}

export default Error