import React, {useEffect} from 'react';
import {NextPage} from "next";
import Layout from "../../components/layouts/Layout";
import {useAppDispatch, useAppSelector} from "../../context/hooks";
import {isEmpty} from "../../shared/utils/object.utils";
import SEO from "../../components/shared/seo";
import {useTranslation} from "../../shared/hooks";
import AdminView from "../../components/admin/AdminView";
import {setView} from "../../context/actions/admin.actions";
import {AdminViews} from "../../shared/types/adminViews.type";

const Admin = () => {

    const {user} = useAppSelector(state => state.user);
    const {view} = useAppSelector(state => state.adminView);

    const t = useTranslation();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const resetState = async () => {
            await dispatch(setView(AdminViews.POSTS));
        }
        return () => {
            resetState();
        }
    }, [dispatch])

    if (isEmpty(user)) {
        return (
            <>
                <SEO title={""} shouldIndex={false} />
            </>
        )
    }

    return (
        <>
            <SEO title={t.admin.title} shouldIndex={false} />
            <AdminView view={view} />
        </>
    );
};

export default Admin;

/* istanbul ignore next */
Admin.getLayout = (page: NextPage) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}