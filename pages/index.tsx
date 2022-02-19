import SEO from "../components/seo";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

export default function Home() {
    const {t} = useTranslation()
    return (
        <>
            <SEO title={"Accueil"} />
            <h1>{t('welcome')}</h1>
            <p>Texte</p>
        </>
    );
}

export const getServerSideProps = async ({locale}: { locale: string }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common']))
    }
});
