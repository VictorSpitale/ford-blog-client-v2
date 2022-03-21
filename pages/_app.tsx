import '../styles/globals.css'
import {AppProps} from "next/app";
import {wrapper} from "../context/store";
import {appWithTranslation} from "next-i18next";
import Layout from "../components/layouts/Layout";
import {AppWrapper} from "../context/AppContext";

function MyApp({Component, pageProps}: AppProps) {
    return (
        <AppWrapper>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </AppWrapper>
    )
}

export default wrapper.withRedux(appWithTranslation(MyApp))
