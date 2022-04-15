import React from 'react';
import Head from "next/head";
import {Children} from "../../shared/types/props.type";
import {useTranslation} from "../../shared/hooks/useTranslation";

type PropsType = {
    description?: string,
    title: string,
    siteTitle?: string,
    children?: Children,
    shouldIndex?: boolean,
}

const SEO = ({
                 description,
                 title,
                 siteTitle,
                 children,
                 shouldIndex = true
             }: PropsType) => {

    const t = useTranslation();

    const getSiteTitle = () => {
        if (!siteTitle) {
            return t.common.siteName
        }
        return siteTitle;
    }

    const getDesc = () => {
        if (!description) {
            return t.common.siteDesc
        }
        return description;
    }

    return (
        <Head>
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <title>{`${title} | ${getSiteTitle()}`}</title>
            <meta name="description" content={getDesc()} />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:site_name" content={getSiteTitle()} />
            <meta property="og:locale" content="fr_FR" />
            <meta property="og:locale:alternate" content="en" />
            {shouldIndex ? <meta name="robots" content="noimageindex" /> :
                <meta name="robots" content="noimageindex, noindex, nofollow" />}
            {children}
        </Head>
    );
};

export default SEO;

