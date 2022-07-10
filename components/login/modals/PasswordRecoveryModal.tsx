import React, {useState} from 'react';
import Modal from "../../modal/Modal";
import {AnyFunction} from "../../../shared/types/props.type";
import InputField from "../../shared/InputField";
import {validateEmail} from "../../../shared/utils/regex.utils";
import {useFetch, useTranslation} from "../../../shared/hooks";
import {IMethods} from "../../../shared/types/methods.type";
import {useRouter} from "next/router";

const PasswordRecoveryModal = ({isShowing, toggle}: { isShowing: boolean; toggle: AnyFunction }) => {

    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const t = useTranslation();
    const {loading, load} = useFetch('/users/password', IMethods.POST, () => setSent(true))
    const handleSubmit = async () => {
        setError('');
        if (email.trim() === "" || !validateEmail(email.trim())) return setError(t.login.error.email);
        await load({email, locale: router.locale || "fr"});
    }

    return (
        <Modal isShowing={isShowing} hide={toggle}>
            <div className={"p-5 pt-0"}>
                <h1 className={"text-center text-2xl mb-3"}>{t.login.recovery.title}</h1>

                {!sent ?
                    <div className={"flex items-end flex-col"}>
                        {error && <p className={"bg-red-500 text-white rounded px-2 w-full mb-2"}>{error}</p>}
                        <InputField name={"email"} onChange={(e) => setEmail(e.target.value)} label={t.login.email} />
                        <button className={"w-fit mt-3 rounded bg-primary-400 text-white px-3 py-1"}
                                onClick={handleSubmit}>{loading ? t.common.loading : t.login.recovery.action}
                        </button>
                    </div>
                    :
                    <div>
                        <p className={"text-justify"}>✔️&#32;{t.login.recovery.text}</p>
                        <button className={"w-fit mt-3 rounded bg-primary-400 text-white px-3 py-1"}
                                onClick={toggle}>{t.login.connect}
                        </button>
                    </div>
                }
            </div>
        </Modal>
    );
};

export default PasswordRecoveryModal;