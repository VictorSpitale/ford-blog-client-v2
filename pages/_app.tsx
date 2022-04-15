import '../styles/globals.css'
import {AppProps} from "next/app";
import {wrapper} from "../context/store";
import Layout from "../components/layouts/Layout";
import {AppWrapper} from "../context/AppContext";

function MyApp({Component, pageProps}: AppProps) {
    const AnyComponent = Component as any;
    // @TODO: https://stackoverflow.com/questions/71809903/next-js-component-cannot-be-used-as-a-jsx-component
    return (
        <AppWrapper>
            <Layout>
                <AnyComponent {...pageProps} />
            </Layout>
        </AppWrapper>
    )
}

export default wrapper.withRedux(MyApp)
