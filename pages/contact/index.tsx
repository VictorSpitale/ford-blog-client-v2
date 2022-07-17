import React from 'react';
import SEO from "../../components/shared/seo";
import {useTranslation} from "../../shared/hooks";
import Layout from "../../components/layouts/Layout";
import {NextPage} from "next";
import ContactForm from "../../components/contact/ContactForm";
import {useAppSelector} from "../../context/hooks";

const Contact = () => {

    const t = useTranslation();
    const {user, pending} = useAppSelector(state => state.user)

    return (
        <>
            <SEO title={t.contact.title} shouldIndex={true} />
            <ContactForm user={user} pending={pending} />
        </>
    );
};

export default Contact;

/* istanbul ignore next */
Contact.getLayout = (page: NextPage) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}