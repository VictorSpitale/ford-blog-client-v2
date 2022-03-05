import '../styles/globals.css'
import {AppProps} from "next/app";
import {wrapper} from "../context/store";
import {appWithTranslation} from "next-i18next";

function MyApp({Component, pageProps}: AppProps) {
    return (<>
            <Component {...pageProps} />
        </>
    )
}

export default wrapper.withRedux(appWithTranslation(MyApp))
