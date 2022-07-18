import React, {useRef, useState} from 'react';
import BaseView from "../shared/BaseView";
import Image from "next/image";
import InputField from "../shared/InputField";
import TextAreaField from "../shared/TextAreaField";
import Button from "../shared/Button";
import {IUser} from "../../shared/types/user.type";
import RenderIf from "../shared/RenderIf";
import {useTranslation} from "../../shared/hooks";
import {useAppDispatch} from "../../context/hooks";
import {sendContactMail} from "../../context/actions/users/user.actions";

type PropsType = {
    user: IUser;
    pending: boolean;
}

const ContactForm = ({user, pending}: PropsType) => {

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const nameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const messageRef = useRef<HTMLTextAreaElement>(null)

    const t = useTranslation();
    const dispatch = useAppDispatch();

    const handleSend = async () => {
        setError("");
        setSuccess("");
        /* istanbul ignore if */
        if (!nameRef.current || !emailRef.current || !messageRef.current) return;
        const [name, email, message] = [nameRef.current.value, emailRef.current.value, messageRef.current.value];
        if (name.trim() === "" || email.trim() === "" || message.trim() === "") {
            return setError(t.contact.errors.fields);
        }
        await dispatch(sendContactMail({message, email, name})).then((res) => {
            if (res.meta.requestStatus === "rejected") {
                return setError(t.common.tryLater);
            }
            setSuccess(t.contact.sent);
            /* istanbul ignore if */
            if (!nameRef.current || !emailRef.current || !messageRef.current) return;
            nameRef.current.value = user.pseudo;
            emailRef.current.value = user.email;
            messageRef.current.value = "";
        })
    }

    return (
        <div className={"mt-16 w-3/4 mx-auto max-w-[800px]"}>
            <h1 className={"text-4xl font-bold mb-6"}>{t.contact.formTitle}</h1>
            <BaseView className={"flex justify-between"}>
                <div className={"w-1/2 items-center min-h-full hidden md:flex"}>
                    <Image alt={"contact"} src={"/static/img/contact.png"} width={611} height={228}
                           objectFit={"cover"} />
                </div>
                <div className={"w-full h-fit md:w-1/2 px-4 flex flex-col gap-y-4 items-end"}>
                    <RenderIf condition={!!error}>
                        <p className={"rounded w-full bg-red-400 text-white px-3 text-justify"}>{error}</p>
                    </RenderIf>
                    <RenderIf condition={!!success}>
                        <p className={"mb-4 rounded w-full bg-green-400 text-white px-3 text-justify"}>{success}</p>
                    </RenderIf>
                    <InputField name={"name"} label={t.contact.fields.name} autoComplete={"username"}
                                value={user.pseudo}
                                ref={nameRef} />
                    <InputField name={"email"} label={t.contact.fields.email} autoComplete={"email"} value={user.email}
                                ref={emailRef} />
                    <TextAreaField name={"message"} label={t.contact.fields.message} rows={9} ref={messageRef} />
                    <Button type={"submit"} element={"button"} onClick={handleSend}
                            text={pending ? t.common.loading : t.common.send}
                            classes={"w-fit"} />
                </div>
            </BaseView>
        </div>
    );
};

export default ContactForm;