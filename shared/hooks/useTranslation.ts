import {useRouter} from "next/router";
import en from "../../public/static/locales/en.json";
import fr from "../../public/static/locales/fr.json";

export function useTranslation(): Translation {
    const router = useRouter();
    const {locale} = router;
    return locale === "en" ? en : fr;
}

export type Translation = typeof en | typeof fr;
