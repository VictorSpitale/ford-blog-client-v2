import React, {FormEvent, useRef, useState} from 'react';
import BaseView from "./BaseView";
import InputField from "../shared/InputField";
import {useAppDispatch, useAppSelector} from "../../context/hooks";
import {deleteAccount, updateLoggedUser} from "../../context/actions/user.actions";
import {useTranslation} from "../../shared/hooks";

const SecurityView = () => {

    const {user, pending} = useAppSelector(state => state.user);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();
    const t = useTranslation();
    const ref = useRef<HTMLInputElement>(null);
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (password.trim() === "" || password.length < 6) {
            return setError('Le mot de passe doit contenir au moins 6 caractères');
        }
        await dispatch(updateLoggedUser({password, _id: user._id})).then((res) => {
            if (res.meta.requestStatus === "rejected") {
                return setError('Erreur lors du changement de mot de passe');
            }
            setPassword('');
            if (ref.current) ref.current.value = '';
            setSuccess("Votre mot de passe a bien été modifié")
        })
    }

    const handleDelete = async () => {
        setError('');
        setSuccess('');
        await dispatch(deleteAccount(user._id)).then((res) => {
            if (res.meta.requestStatus === "rejected") {
                return setError("Erreur lors de la suppression du compte")
            }
        })
    }

    return (
        <BaseView>
            <h1 className={"text-2xl font-semibold mb-4"}>Sécurité</h1>
            <p className={"mb-4 rounded w-full bg-red-400 text-white px-3 text-justify"}>{error}</p>
            <p className={"mb-4 rounded w-full bg-green-400 text-white px-3 text-justify"}>{success}</p>
            <form onSubmit={handleSubmit}>
                <div className={"hidden"}>
                    <input autoComplete={"email"} value={user.email} readOnly={true} />
                </div>
                <InputField name={"password"} label={"Mot de passe"} type={"password"}
                            autoComplete={"new-password"} ref={ref}
                            onChange={(e) => setPassword(e.target.value)} />
                <div className={"flex justify-end"}>
                    <button type={"submit"}
                            className={"mt-5 rounded text-white bg-primary-400 px-3 py-1"}>{pending ? t.common.loading : "Sauvegarder"}
                    </button>
                </div>
            </form>
            <hr className={"my-3"} />
            <h1 className={"text-2xl text-red-500"}>Suppression de compte</h1>
            <p>Attention : Vous ne pourrez pas revenir en arrière. Toutes vos données seront supprimées
                instantanément.</p>
            <button onClick={handleDelete}
                    className={"mt-3 rounded text-red-500 border px-2 shadow hover:bg-red-500 hover:text-white"}>Supprimer
                mon compte
            </button>
        </BaseView>
    );
};

export default SecurityView;