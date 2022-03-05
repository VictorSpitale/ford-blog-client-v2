import React from 'react';
import Head from "next/head";
import {Children} from "../shared/types/props.type";

type PropsType = {
    description?: string,
    title: string,
    siteTitle?: string,
    children?: Children
}

const defaultSiteTitle = process.env.NEXT_PUBLIC_SITE_TITLE
const defaultDescription = "Ford Universe, blog sur l'automobile consacré à Ford"

const SEO = ({description = defaultDescription, title, siteTitle = defaultSiteTitle, children}: PropsType) => {
    return (
        <Head>
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <title>{`${title} | ${siteTitle}`}</title>
            <meta name="description" content={description} />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:site_name" content={siteTitle} />
            <meta property="og:locale" content="fr_FR" />
            <meta property="og:locale:alternate" content="en_US" />
            <meta name="robots" content="noimageindex" />
            {children}
        </Head>
    );
};

export default SEO;

