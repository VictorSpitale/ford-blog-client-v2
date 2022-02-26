import SEO from "../components/seo";
import {NextPage} from "next";
import {wrapper} from "../context/store";
import {getPosts} from "../context/actions/posts.actions";
import {useAppSelector} from "../context/hooks";
import dynamic from "next/dynamic";
import {changeStatus} from "../context/actions/firstHydrate.actions";
import {HydrateStatus} from "../context/reducers/firstHydrate.reducer";

const LoadingScreen = dynamic(() => import("../components/LoadingScreen"))
const LastPosts = dynamic(() => import("../components/posts/LastPosts"))

const Home: NextPage = () => {

    const {posts, pending} = useAppSelector((state) => state.posts);
    const {status} = useAppSelector((state) => state.hydrateStatus)

    return (
        <>
            <SEO title={pending ? 'Chargement...' : 'Accueil'} />
            <LoadingScreen isLoading={pending} alreadyLoaded={status !== HydrateStatus.FIRST}>
                <div className={"px-1 mx-auto w-fit grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4"}>
                    <LastPosts posts={posts} />
                </div>
            </LoadingScreen>
        </>
    );
}
Home.getInitialProps = wrapper.getInitialPageProps(
    ({dispatch}) =>
        async () => {
            await dispatch(getPosts());
            await dispatch(changeStatus())
        }
);

export default Home