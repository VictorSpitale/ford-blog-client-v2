import '../styles/globals.css'
import {wrapper} from "../context/store";
import {AppWrapper} from "../context/AppContext";
import {AppPropsWithLayout} from "../shared/types/page.type";


function MyApp({Component, pageProps}: AppPropsWithLayout) {

    const getLayout = Component.getLayout || ((page) => page)

    return getLayout(
        <AppWrapper>
            <Component {...pageProps} />
        </AppWrapper>
    )
}

export default wrapper.withRedux(MyApp)
