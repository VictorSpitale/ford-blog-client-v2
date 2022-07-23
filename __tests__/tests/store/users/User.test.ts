import userReducer, {UserState} from "../../../../context/reducers/users/user.reducer";
import {AnyAction} from "@reduxjs/toolkit";
import {
    deleteAccount,
    getUser,
    login,
    logout,
    removePicture,
    sendContactMail,
    updateUser,
    uploadPicture
} from "../../../../context/actions/users/user.actions";
import {IUser, IUserRole} from "../../../../shared/types/user.type";
import {UserStub} from "../../../stub/UserStub";
import * as fetch from "../../../../context/instance";
import {makeStore} from "../../../../context/store";
import {HttpErrorStub} from "../../../stub/HttpErrorStub";

describe('User Reducer & Actions', function () {

    const initialState: UserState = {
        user: {} as IUser, pending: false, error: false
    }

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should return the initial state', () => {
        expect(userReducer(undefined, {} as AnyAction)).toEqual(initialState);
    })

    describe('Get User', function () {

        it('should set pending true while fetching a user', () => {
            const action: AnyAction = {type: getUser.pending};
            const state = userReducer(initialState, action);
            expect(state).toEqual({
                ...initialState,
                pending: true
            })
        })

        it('should set pending false and not set error to true (unused error)', () => {
            const action: AnyAction = {type: getUser.rejected};
            const state = userReducer(initialState, action);
            expect(state).toEqual(initialState);
        })

        it('should set the user and pending false', () => {
            const action: AnyAction = {type: getUser.fulfilled, payload: UserStub()};
            const state = userReducer({
                ...initialState, pending: true
            }, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                user: UserStub()
            });
        })

        it('should fetch a user if user state is empty', async () => {
            const getUserSpy = jest.spyOn(fetch, "fetchApi").mockResolvedValue({
                data: UserStub()
            })
            const store = makeStore();
            await store.dispatch(getUser());
            expect(getUserSpy).toHaveBeenCalledWith("/api/auth/jwt", {method: "get"});
            expect(store.getState().user.user).toEqual(UserStub());
            getUserSpy.mockClear();
        })

        it('should not fetch a user if user is not empty', async () => {
            const getUserSpy = jest.spyOn(fetch, "fetchApi").mockResolvedValue({
                data: UserStub()
            })
            const store = makeStore();
            await store.dispatch(getUser());
            await store.dispatch(getUser());
            expect(getUserSpy).toHaveBeenCalledTimes(1);
        })

        it('should fetch a user and execute the callback if user state is empty', async () => {
            const user = UserStub();
            const getUserSpy = jest.spyOn(fetch, "fetchApi").mockResolvedValue({
                data: user
            })
            const store = makeStore();
            const fn = jest.fn();
            await store.dispatch(getUser(fn));
            expect(getUserSpy).toHaveBeenCalledWith("/api/auth/jwt", {method: "get"});
            expect(store.getState().user.user).toEqual(user);
            expect(fn).toHaveBeenCalledWith(user._id);
        })

    });

    describe('Logout', function () {

        it('should reset user on logout', function () {
            const action: AnyAction = {
                type: logout.fulfilled
            }
            const state = userReducer({
                ...initialState,
                user: UserStub()
            }, action);
            expect(state).toEqual(initialState);
        });

        it('should not reset user on failed logout', function () {
            const action: AnyAction = {
                type: logout.rejected
            }
            const state = userReducer({
                ...initialState,
                user: UserStub()
            }, action);
            expect(state).toEqual({
                ...initialState,
                user: UserStub()
            });
        });

        it('should reset the user (action)', async () => {
            const logoutSpy = jest.spyOn(fetch, "fetchApi").mockResolvedValue({});
            const store = makeStore();
            await store.dispatch(logout());
            expect(logoutSpy).toHaveBeenCalledWith("/api/auth/logout", {method: "get"});
            expect(store.getState().user.user).toEqual({});
        })

    });

    describe('Login', function () {

        it('should set a user', () => {
            const action: AnyAction = {type: login, payload: UserStub()};
            const state = userReducer(initialState, action);
            expect(state).toEqual({
                ...initialState,
                user: UserStub()
            });
        })

    });

    describe('Update Logged User', function () {

        it('should set pending true while updating a user', () => {
            const action: AnyAction = {type: updateUser.pending};
            const state = userReducer(initialState, action);
            expect(state).toEqual({
                ...initialState,
                pending: true
            })
        })

        it('should set pending false and not set error to true (unused error)', () => {
            const action: AnyAction = {type: updateUser.rejected};
            const state = userReducer({...initialState, pending: true}, action);
            expect(state).toEqual(initialState);
        })

        it('should replace the user and pending false', () => {
            const action: AnyAction = {type: updateUser.fulfilled, payload: {...UserStub(), pseudo: "nouveau"}};
            const state = userReducer({
                ...initialState, pending: true, user: UserStub()
            }, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                user: {...UserStub(), pseudo: "nouveau"}
            });
        })

        it('should not affect the logged user if the updated user is not the same', function () {
            const action: AnyAction = {
                type: updateUser.fulfilled,
                payload: {...UserStub(IUserRole.USER, "01"), pseudo: "nouveau"}
            };
            const state = userReducer({
                ...initialState, pending: true, user: UserStub(IUserRole.USER, "02")
            }, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                user: UserStub(IUserRole.USER, "02")
            });
        });

        it('should fetch the updated user', async () => {
            const user = UserStub();
            const getUserSpy = jest.spyOn(fetch, "fetchApi").mockResolvedValue({
                data: {...user, pseudo: "nouveau pseudo"}
            })
            const store = makeStore();
            const data = {_id: user._id, pseudo: "nouveau pseudo"};
            await store.dispatch(login(user));
            await store.dispatch(updateUser(data));
            expect(getUserSpy).toHaveBeenCalledWith(`/api/users/{id}`, {
                method: "patch",
                params: {id: user._id},
                json: {password: undefined, pseudo: "nouveau pseudo"}
            });
            expect(store.getState().user.user).toEqual({...UserStub(), pseudo: "nouveau pseudo"});
        })

        it('should not update the user on failure', async () => {
            const user = UserStub();
            const errorData = {
                message: "message",
                code: 1,
                status: 400
            }
            const getUserSpy = jest.spyOn(fetch, "fetchApi").mockRejectedValue({
                response: {
                    data: errorData
                }
            })
            const store = makeStore();
            const data = {_id: user._id};
            await store.dispatch(updateUser(data)).then(res => {
                // Interceptor not included
                expect(res.payload).toEqual({
                    response: {
                        data: errorData
                    }
                });
            });
            expect(getUserSpy).toHaveBeenCalledWith("/api/users/{id}",
                {
                    "json": {
                        "password": undefined,
                        "pseudo": undefined,
                    },
                    "method": "patch",
                    "params": {
                        "id": "625d68b498cce1a4044d887c",
                    }
                });
        })

    });

    describe('Upload Picture', function () {

        it('should set pending true while updating user\'s picture', () => {
            const action: AnyAction = {type: uploadPicture.pending};
            const state = userReducer(initialState, action);
            expect(state).toEqual({
                ...initialState,
                pending: true
            })
        })

        it('should set pending false and not set error to true (unused error)', () => {
            const action: AnyAction = {type: uploadPicture.rejected};
            const state = userReducer({...initialState, pending: true}, action);
            expect(state).toEqual(initialState);
        })

        it('should replace the user\'s picture and pending false', () => {
            const action: AnyAction = {
                type: uploadPicture.fulfilled,
                payload: {picture: 'picture link', _id: UserStub()._id}
            };
            const state = userReducer({
                ...initialState, pending: true, user: UserStub()
            }, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                user: {
                    ...UserStub(),
                    picture: 'picture link'
                }
            });
        })

        it('should not affect the logged user if the user is not the same on upload', function () {
            const action: AnyAction = {
                type: uploadPicture.fulfilled,
                payload: {picture: 'picture link', _id: UserStub()._id}
            };
            const state = userReducer({
                ...initialState, pending: true, user: UserStub(IUserRole.USER, "01")
            }, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                user: UserStub(IUserRole.USER, "01")
            });
        })

        it('should upload the profile picture', async () => {
            const user = UserStub();
            const getUserSpy = jest.spyOn(fetch, "fetchApi").mockResolvedValue({
                data: {
                    picture: "picture"
                }
            })
            const store = makeStore();
            const data = {_id: user._id, data: new FormData()};
            await store.dispatch(login(user));
            await store.dispatch(uploadPicture(data));
            expect(getUserSpy).toHaveBeenCalledWith(`/api/users/upload/{id}`, {
                data: data.data,
                method: "patch",
                params: {id: data._id}
            });
            expect(store.getState().user.user.picture).toEqual('picture');
        })
    });

    describe('Remove Picture', function () {

        it('should set pending true while removing profile picture', () => {
            const action: AnyAction = {type: removePicture.pending};
            const state = userReducer(initialState, action);
            expect(state).toEqual({
                ...initialState,
                pending: true
            })
        })

        it('should set pending false and not set error to true (unused error)', () => {
            const action: AnyAction = {type: removePicture.rejected};
            const state = userReducer({...initialState, pending: true}, action);
            expect(state).toEqual(initialState);
        })

        it('should remove the profile picture from the user and pending false', () => {
            const action: AnyAction = {type: removePicture.fulfilled, payload: UserStub()};
            const state = userReducer({
                ...initialState, pending: true, user: {...UserStub(), picture: 'picture'}
            }, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                user: UserStub()
            });
        })

        it('should not affect the logged user on remove picture from another user', () => {
            const action: AnyAction = {type: removePicture.fulfilled, payload: UserStub()};
            const state = userReducer({
                ...initialState, pending: true, user: {
                    ...UserStub(IUserRole.USER, "01"), picture: "link"
                }
            }, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                user: {
                    ...UserStub(IUserRole.USER, "01"), picture: "link"
                }
            });
        })

        it('should remove the profile picture', async () => {
            const user = UserStub();
            const getUserSpy = jest.spyOn(fetch, "fetchApi").mockResolvedValue({})
            const store = makeStore();
            await store.dispatch(login(user));
            await store.dispatch(removePicture(user));
            expect(getUserSpy).toHaveBeenCalledWith("/api/users/upload/{id}", {
                method: "delete",
                params: {id: user._id}
            });
            expect(store.getState().user.user.picture).not.toBeDefined();
        })

    });

    describe('Delete Account', function () {

        it('should set pending true while deleting the account', () => {
            const action: AnyAction = {type: deleteAccount.pending};
            const state = userReducer(initialState, action);
            expect(state).toEqual({
                ...initialState,
                pending: true
            })
        })

        it('should set pending false and not set error to true (unused error)', () => {
            const action: AnyAction = {type: deleteAccount.rejected};
            const state = userReducer({...initialState, pending: true}, action);
            expect(state).toEqual(initialState);
        })

        it('should delete the account and set pending false', () => {
            const action: AnyAction = {type: deleteAccount.fulfilled, payload: UserStub()};
            const state = userReducer({
                ...initialState, pending: true, user: UserStub()
            }, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                user: {}
            });
        })

        it('should not affect the logged user on delete another user account', () => {
            const action: AnyAction = {type: deleteAccount.fulfilled, payload: UserStub()};
            const state = userReducer({
                ...initialState, pending: true, user: UserStub(IUserRole.USER, "01")
            }, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                user: UserStub(IUserRole.USER, "01")
            });
        })

        it('should delete the account', async () => {
            const user = UserStub();
            const getUserSpy = jest.spyOn(fetch, "fetchApi").mockResolvedValue({})
            const store = makeStore();
            await store.dispatch(login(user));
            await store.dispatch(deleteAccount(user));
            expect(getUserSpy).toHaveBeenCalledWith("/api/users/{id}", {
                "method": "delete",
                "params": {"id": user._id}
            });
            expect(store.getState().user.user).toEqual({});
        })
    });


    describe('SendContactMail', function () {

        it('should set pending true while sending', () => {
            const action: AnyAction = {type: sendContactMail.pending};
            const state = userReducer(initialState, action);
            expect(state).toEqual({
                ...initialState,
                pending: true
            })
        })

        it('should set pending false on rejected', () => {
            const action: AnyAction = {type: sendContactMail.rejected};
            const state = userReducer({...initialState, pending: true}, action);
            expect(state).toEqual(initialState);
        })

        it('should set pending false on sent', () => {
            const action: AnyAction = {type: sendContactMail.fulfilled};
            const state = userReducer({
                ...initialState, pending: true
            }, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
            });
        })

        it('should send a mail', async () => {
            const sendContactMailSpy = jest.spyOn(fetch, "fetchApi").mockResolvedValue({})
            const store = makeStore();
            await store.dispatch(sendContactMail({name: "name", email: "email", message: "message"}));
            expect(sendContactMailSpy).toHaveBeenCalledWith("/api/mail/contact", {
                "method": "post",
                json: {name: "name", email: "email", message: "message"}
            });
            expect(store.getState().user).toEqual(initialState);
        })

        it('should send error on rejected mail', async () => {
            const sendContactMailSpy = jest.spyOn(fetch, "fetchApi").mockRejectedValueOnce(HttpErrorStub())
            const store = makeStore();
            await store.dispatch(sendContactMail({name: "name", email: "email", message: "message"})).then((res) => {
                expect(res).toEqual({...res, payload: HttpErrorStub()})
            });
            expect(sendContactMailSpy).toHaveBeenCalledWith("/api/mail/contact", {
                "method": "post",
                json: {name: "name", email: "email", message: "message"}
            });
            expect(store.getState().user).toEqual(initialState);
        })
    });

});