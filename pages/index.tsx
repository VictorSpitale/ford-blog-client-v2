import SEO from "../components/seo";
import LoadingScreen from "../components/LoadingScreen";
import {useEffect, useState} from "react";

export default function Home() {

    //@TODO: initialState = true
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // setTimeout(() => {
        //     setIsLoading(false)
        // }, 2000)
    }, [])

    return (
        <>
            <SEO title={"Accueil"} />
            <LoadingScreen isLoading={isLoading}>
                <p className={"px-5"}>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi deserunt doloremque earum labore
                    tempora? Ducimus impedit nobis quod sapiente temporibus voluptates. Amet at, aut dignissimos dolore
                    expedita nesciunt? Maiores, minima.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate dicta earum ipsam minima optio
                    quibusdam sint soluta. Debitis incidunt inventore laborum libero reiciendis rem voluptas? Dolorem
                    praesentium qui voluptate voluptatem!
                </p>
            </LoadingScreen>
        </>
    );
}

// export const getServerSideProps = async ({locale}: { locale: string }) => ({
//     props: {
//         ...(await serverSideTranslations(locale, ['common']))
//     }
// });
