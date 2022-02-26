import SEO from "../components/seo";
import LoadingScreen from "../components/LoadingScreen";
import LastPosts from "../components/posts/LastPosts";
import {NextPage} from "next";
import {IPost} from "../shared/types/post.type";

const Home: NextPage = () => {

    const pending = false;
    const isAlreadyLoaded = true;
    const data: IPost[] = []

    return (
        <>
            <SEO title={pending ? 'Chargement...' : 'Accueil'} />
            <LoadingScreen alreadyLoaded={isAlreadyLoaded} isLoading={pending}>
                <div className={"px-1 mx-auto w-fit grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4"}>
                    <LastPosts posts={data} />
                </div>
            </LoadingScreen>
        </>
    );
}

export default Home