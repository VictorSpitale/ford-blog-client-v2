import SEO from "../components/seo";
import LoadingScreen from "../components/LoadingScreen";
import {useEffect, useState} from "react";
import PostCard from "../components/posts/PostCard";
import {postStub} from "../tests/stub/postStub";

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
            <SEO title={isLoading ? 'Chargement...' : 'Accueil'} />
            <LoadingScreen isLoading={isLoading}>
                <div className={"px-5 mx-auto w-fit"}>
                    <PostCard post={postStub()} />
                </div>
            </LoadingScreen>
        </>
    );
}

// export const getServerSideProps = async ({locale}: { locale: string }) => ({
//     props: {
//         ...(await serverSideTranslations(locale, ['common']))
//     }
// });
