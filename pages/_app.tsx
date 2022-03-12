import '../styles/globals.css'
import {AppProps} from "next/app";
import {wrapper} from "../context/store";
import {appWithTranslation} from "next-i18next";
import Layout from "../components/layouts/Layout";

function MyApp({Component, pageProps}: AppProps) {
    return (<Layout>
            <Component {...pageProps} />
        </Layout>
    )
}

export default wrapper.withRedux(appWithTranslation(MyApp))
