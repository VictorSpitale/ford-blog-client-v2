import React, {useCallback, useEffect, useState} from 'react';
import BaseView from "../../shared/BaseView";
import {useModal, useTranslation} from "../../../shared/hooks";
import {useAppDispatch, useAppSelector} from "../../../context/hooks";
import RenderIf from "../../shared/RenderIf";
import {isEmpty} from "../../../shared/utils/object.utils";
import Table from "../../table/Table";
import {getUsers} from "../../../context/actions/users/users.actions";
import {IUser} from "../../../shared/types/user.type";
import DetailsModal from "../modals/DetailsModal";

const UsersView = () => {

    const t = useTranslation();
    const dispatch = useAppDispatch();

    const {users, pending} = useAppSelector(state => state.users);

    const [detailsUser, setDetailsUser] = useState({} as IUser);

    const {
        toggle: toggleDetails,
        isShowing: isDetailsShowing,
        addOtherModal,
        otherModal,
        previous,
        hasPrevious
    } = useModal();

    const fetchUsers = useCallback(async () => {
        await dispatch(getUsers());
    }, [dispatch]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const openDetails = useCallback((user: IUser) => {
        setDetailsUser({...user});
        toggleDetails();
    }, []);

    const openEdit = useCallback((user: IUser) => {
        console.log("edition :", user)
    }, [])

    const openDelete = useCallback((user: IUser) => {
        console.log("suppression :", user)
    }, [])

    return (
        <>
            <RenderIf condition={isDetailsShowing}>
                <DetailsModal isShowing={isDetailsShowing} toggle={toggleDetails}
                              content={{type: "users", data: detailsUser}} otherModal={otherModal}
                              setOtherModal={addOtherModal}
                              hasPrevious={hasPrevious} previous={previous} />
            </RenderIf>
            <BaseView>
                <div className={"flex items-center mb-4"}>
                    <h1 className={"text-2xl font-semibold"}>{t.admin.users.title}</h1>
                    <RenderIf condition={pending}>
                        <p className={"italic ml-4"}>Chargement...</p>
                    </RenderIf>
                </div>
                <RenderIf condition={isEmpty((users))}>
                    <p>Aucune catégories disponible</p>
                </RenderIf>
                <RenderIf condition={!isEmpty((users))}>
                    <Table keys={[
                        {key: "pseudo", label: "Nom"},
                        {key: "email", label: "Email"},
                    ]} data={users} sortable={true} onOpen={openDetails} actions={[
                        {
                            label: "Modifier",
                            color: "primary",
                            onClick: openEdit
                        }, {
                            label: "Supprimer",
                            onClick: openDelete,
                            color: "danger"
                        }
                    ]}
                    />
                </RenderIf>
            </BaseView>
        </>
    );
};

export default UsersView;