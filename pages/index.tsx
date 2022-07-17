import SEO from "../components/shared/seo";
import {wrapper} from "../context/store";
import {getLastPosts} from "../context/actions/posts.actions";
import {useAppSelector} from "../context/hooks";
import dynamic from "next/dynamic";
import {changeStatus} from "../context/actions/firstHydrate.actions";
import {HydrateStatus} from "../context/reducers/firstHydrate.reducer";
import {useTranslation} from "../shared/hooks";
import {ReactElement} from "react";
import Layout from "../components/layouts/Layout";
import {NextPageWithLayout} from "../shared/types/page.type";

const LoadingScreen = dynamic(() => import("../components/LoadingScreen"))
const PostsList = dynamic(() => import("../components/posts/PostsList"))

const Home: NextPageWithLayout = () => {
    const {posts, pending} = useAppSelector((state) => state.lastPosts);
    const {status} = useAppSelector((state) => state.hydrateStatus)

    const t = useTranslation();

    return (
        <>
            <SEO title={pending ? t.common.loading : t.common.home} />
            <LoadingScreen isLoading={pending} alreadyLoaded={status !== HydrateStatus.FIRST}>
                {posts.length === 0 ?
                    (<h1 className={"text-center text-2xl"}>{t.common.noPost}</h1>) :
                    (<div className={"px-1 mx-auto w-fit grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4"}>
                        <PostsList posts={posts} />
                    </div>)
                }
            </LoadingScreen>
        </>
    );
}

/* istanbul ignore next */
Home.getInitialProps = wrapper.getInitialPageProps(
    ({dispatch}) =>
        async () => {
            await dispatch(getLastPosts());
            await dispatch(changeStatus())
        }
);

/* istanbul ignore next */
Home.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

export default Home

