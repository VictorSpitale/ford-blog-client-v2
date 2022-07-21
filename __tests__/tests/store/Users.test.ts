import {usersReducer, UsersState} from "../../../context/reducers/users/users.reducer";
import {AnyAction} from "@reduxjs/toolkit";
import {getUsers} from "../../../context/actions/users/users.actions";
import {UserStub} from "../../stub/UserStub";
import {getUserById} from "../../../context/actions/admin/admin.actions";
import {IUserRole} from "../../../shared/types/user.type";
import * as fetch from "../../../context/instance";
import {makeStore} from "../../../context/store";
import {deleteAccount, removePicture, updateUser, uploadPicture} from "../../../context/actions/users/user.actions";
import {HttpErrorStub} from "../../stub/HttpErrorStub";

describe('Users Actions & Reducers', function () {

    const initialState: UsersState = {
        allFetched: false,
        error: false,
        pending: false,
        users: []
    }

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should return the initial state', () => {
        expect(usersReducer(undefined, {} as AnyAction)).toEqual(initialState);
    })

    describe('getUsers', function () {

        it('should set pending true while fetching users', function () {
            const action: AnyAction = {type: getUsers.pending}
            const state = usersReducer(initialState, action);
            expect(state).toEqual({...initialState, pending: true})
        });

        it('should set pending false and set users', function () {
            const action: AnyAction = {type: getUsers.fulfilled, payload: [UserStub()]}
            const state = usersReducer({...initialState, pending: true}, action);
            expect(state).toEqual({...initialState, users: [UserStub()], allFetched: true})
        });

        it('should set pending false on reject', function () {
            const action: AnyAction = {type: getUsers.rejected}
            const state = usersReducer({...initialState, pending: true}, action);
            expect(state).toEqual({...initialState})
        });

        it('should fetch the users and not fetch if all users are already fetched', async function () {
            const getUsersSpy = jest.spyOn(fetch, "fetchApi").mockResolvedValue({
                data: [UserStub()]
            })
            const store = makeStore();
            await store.dispatch(getUsers());
            await store.dispatch(getUsers());
            expect(getUsersSpy).toHaveBeenCalledTimes(1);
            expect(getUsersSpy).toHaveBeenCalledWith("/api/users", {method: "get"});
            expect(store.getState().users.users).toEqual([UserStub()]);
        });
    });

    describe('getUserById', function () {

        it('should set pending true while fetching user', function () {
            const action: AnyAction = {type: getUserById.pending}
            const state = usersReducer(initialState, action);
            expect(state).toEqual({...initialState, pending: true})
        });

        it('should set pending false on reject', function () {
            const action: AnyAction = {type: getUserById.rejected}
            const state = usersReducer({...initialState, pending: true}, action);
            expect(state).toEqual({...initialState})
        });

        it('should add the fetched user', function () {
            const action: AnyAction = {type: getUserById.fulfilled, payload: UserStub(IUserRole.USER, "01")}
            const state = usersReducer({...initialState, users: [UserStub(IUserRole.USER, "02")]}, action);
            expect(state).toEqual({
                ...initialState,
                users: [UserStub(IUserRole.USER, "02"), UserStub(IUserRole.USER, "01")]
            })
        });

        it('should replace the user if he is already in the list', function () {
            const action: AnyAction = {
                type: getUserById.fulfilled,
                payload: {...UserStub(IUserRole.USER, "01"), pseudo: "newPseudo"}
            }
            const state = usersReducer({
                ...initialState,
                users: [UserStub(IUserRole.USER, "01"), UserStub(IUserRole.USER, "02")]
            }, action);
            expect(state).toEqual({
                ...initialState,
                users: [
                    {...UserStub(IUserRole.USER, "01"), pseudo: "newPseudo"},
                    UserStub(IUserRole.USER, "02")
                ]
            })
        });

        it('should fetch the user then return the cached user on second fetch', async function () {
            const getUserByIdSpy = jest.spyOn(fetch, "fetchApi").mockResolvedValue({
                data: UserStub(IUserRole.USER, "01")
            })
            const store = makeStore();
            await store.dispatch(getUserById("01"));
            await store.dispatch(getUserById("01"));
            expect(getUserByIdSpy).toHaveBeenCalledTimes(1);
            expect(getUserByIdSpy).toHaveBeenCalledWith("/api/users/{id}", {method: "get", params: {id: "01"}});
            expect(store.getState().users.users).toEqual([UserStub(IUserRole.USER, "01")]);
        });

    });

    describe('removePicture', function () {

        it('should set pending true while removing user\'s picture', function () {
            const action: AnyAction = {type: removePicture.pending}
            const state = usersReducer(initialState, action);
            expect(state).toEqual({...initialState, pending: true})
        });

        it('should set pending false on reject', function () {
            const action: AnyAction = {type: removePicture.rejected}
            const state = usersReducer({...initialState, pending: true}, action);
            expect(state).toEqual({...initialState})
        });

        it('should replace the user with an undefined picture', function () {
            const action: AnyAction = {type: removePicture.fulfilled, payload: UserStub(IUserRole.USER, "01")}
            const state = usersReducer({
                ...initialState,
                users: [
                    {...UserStub(IUserRole.USER, "01"), picture: "link"},
                    {...UserStub(IUserRole.USER, "02"), picture: "link"}
                ]
            }, action);
            expect(state).toEqual({
                ...initialState,
                users: [
                    UserStub(IUserRole.USER, "01"),
                    {...UserStub(IUserRole.USER, "02"), picture: "link"}
                ]
            })
        });

        it('should fetch and replace the user with an undefined picture', async function () {
            const removePictureSpy = jest.spyOn(fetch, "fetchApi").mockResolvedValue({
                data: {...UserStub(IUserRole.USER, "01"), picture: "link"}
            }).mockResolvedValue({
                data: UserStub(IUserRole.USER, "01")
            })
            const store = makeStore();
            await store.dispatch(getUserById("01"))
            await store.dispatch(removePicture(UserStub(IUserRole.USER, "01")));
            expect(removePictureSpy).toHaveBeenCalledWith("/api/users/upload/{id}", {
                method: "delete",
                params: {id: "01"}
            });
            expect(store.getState().users.users).toEqual([UserStub(IUserRole.USER, "01")]);
        });

    });

    describe('uploadPicture', function () {

        it('should not set pending true while uploading user\'s picture ' +
            'because users can only changes their own picture, this does not affect all users state', function () {
            const action: AnyAction = {type: uploadPicture.pending}
            const state = usersReducer(initialState, action);
            expect(state).toEqual({...initialState})
        });

        it('should not change pending status on reject because it is not changed on pending', function () {
            const action: AnyAction = {type: uploadPicture.rejected}
            const state = usersReducer({...initialState}, action);
            expect(state).toEqual({...initialState})
        });

        it('should replace the user with its picture', function () {
            const action: AnyAction = {
                type: uploadPicture.fulfilled,
                payload: {...UserStub(IUserRole.USER, "01"), picture: "link"}
            }
            const state = usersReducer({
                ...initialState,
                users: [
                    UserStub(IUserRole.USER, "01"),
                    UserStub(IUserRole.USER, "02")
                ]
            }, action);
            expect(state).toEqual({
                ...initialState,
                users: [
                    {...UserStub(IUserRole.USER, "01"), picture: "link"},
                    UserStub(IUserRole.USER, "02"),
                ]
            })
        });

        it('should fetch and replace the new user with its picture', async function () {
            const uploadPictureSpy = jest.spyOn(fetch, "fetchApi").mockResolvedValue({
                data: UserStub(IUserRole.USER, "01")
            }).mockResolvedValue({
                data: {...UserStub(IUserRole.USER, "01"), picture: "link"}
            })
            const store = makeStore();
            await store.dispatch(getUserById("01"))
            await store.dispatch(uploadPicture({_id: "01", data: new FormData()}));
            expect(uploadPictureSpy).toHaveBeenCalledWith("/api/users/upload/{id}", {
                method: "patch",
                params: {id: "01"},
                data: new FormData()
            });
            expect(store.getState().users.users).toEqual([{...UserStub(IUserRole.USER, "01"), picture: "link"}]);
        });

    });

    describe('updateUser', function () {

        it('should set pending true while updating a user', function () {
            const action: AnyAction = {type: updateUser.pending}
            const state = usersReducer(initialState, action);
            expect(state).toEqual({...initialState, pending: true})
        });

        it('should set pending false on reject', function () {
            const action: AnyAction = {type: updateUser.rejected}
            const state = usersReducer({...initialState, pending: true}, action);
            expect(state).toEqual({...initialState})
        });

        it('should replace the user with its new information', function () {
            const action: AnyAction = {
                type: updateUser.fulfilled, payload: {
                    ...UserStub(IUserRole.USER, "01"
                    ), pseudo: "newPseudo"
                }
            }
            const state = usersReducer({
                ...initialState,
                users: [
                    UserStub(IUserRole.USER, "01"),
                    UserStub(IUserRole.USER, "02")
                ]
            }, action);
            expect(state).toEqual({
                ...initialState,
                users: [
                    {...UserStub(IUserRole.USER, "01"), pseudo: "newPseudo"},
                    UserStub(IUserRole.USER, "02")
                ]
            })
        });

        it('should fetch and replace the user', async function () {
            const updateUserSpy = jest.spyOn(fetch, "fetchApi").mockResolvedValue({
                data: UserStub(IUserRole.USER, "01")
            }).mockResolvedValue({
                data: {...UserStub(IUserRole.USER, "01"), pseudo: "newPseudo"}
            })
            const store = makeStore();
            await store.dispatch(getUserById("01"))
            await store.dispatch(updateUser({_id: "01", pseudo: "newPseudo"}));
            expect(updateUserSpy).toHaveBeenCalledWith("/api/users/{id}", {
                method: "patch",
                params: {id: "01"},
                json: {pseudo: "newPseudo"}
            });
            expect(store.getState().users.users).toEqual([{...UserStub(IUserRole.USER, "01"), pseudo: "newPseudo"}]);
        });

        it('should fetch and reject the user update', async function () {
            const updateUserSpy = jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({
                data: UserStub(IUserRole.USER, "01")
            }).mockRejectedValueOnce(HttpErrorStub());

            const store = makeStore();
            await store.dispatch(getUserById("01"))
            await store.dispatch(updateUser({_id: "01", pseudo: "newPseudo"})).then((res) => {
                expect(res).toEqual({...res, payload: HttpErrorStub()});
            });
            expect(updateUserSpy).toHaveBeenCalledWith("/api/users/{id}", {
                method: "patch",
                params: {id: "01"},
                json: {pseudo: "newPseudo"}
            });
            expect(store.getState().users.users).toEqual([UserStub(IUserRole.USER, "01")]);
        });

    });

    describe('deleteAccount', function () {

        it('should set pending true while deleting a user', function () {
            const action: AnyAction = {type: deleteAccount.pending}
            const state = usersReducer(initialState, action);
            expect(state).toEqual({...initialState, pending: true})
        });

        it('should set pending false on reject', function () {
            const action: AnyAction = {type: deleteAccount.rejected}
            const state = usersReducer({...initialState, pending: true}, action);
            expect(state).toEqual({...initialState})
        });

        it('should delete the user', function () {
            const action: AnyAction = {
                type: deleteAccount.fulfilled, payload: UserStub(IUserRole.USER, "01")
            }
            const state = usersReducer({
                ...initialState,
                users: [
                    UserStub(IUserRole.USER, "01"),
                    UserStub(IUserRole.USER, "02")
                ]
            }, action);
            expect(state).toEqual({
                ...initialState,
                users: [
                    UserStub(IUserRole.USER, "02")
                ]
            })
        });

        it('should fetch and delete the user', async function () {
            const deleteAccountSpy = jest.spyOn(fetch, "fetchApi").mockResolvedValue({
                data: UserStub(IUserRole.USER, "01")
            }).mockResolvedValue({
                data: UserStub(IUserRole.USER, "01")
            })
            const store = makeStore();
            await store.dispatch(getUserById("01"))
            await store.dispatch(deleteAccount(UserStub(IUserRole.USER, "01")))
            expect(deleteAccountSpy).toHaveBeenCalledWith("/api/users/{id}", {
                method: "delete",
                params: {id: "01"},
            });
            expect(store.getState().users.users).toEqual([]);
        });

    });

});