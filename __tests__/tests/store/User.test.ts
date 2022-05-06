import userReducer, {UserState} from "../../../context/reducers/user.reducer";
import {AnyAction} from "@reduxjs/toolkit";
import {
    deleteAccount,
    getUser,
    login,
    logout,
    removePicture,
    updateLoggedUser,
    uploadPicture
} from "../../../context/actions/user.actions";
import {IUser} from "../../../shared/types/user.type";
import {UserStub} from "../../stub/UserStub";
import {instance} from "../../../context/instance";
import {makeStore} from "../../../context/store";

describe('User Reducer & Actions', function () {
    const initialState: UserState = {
        user: {} as IUser, pending: false, error: false
    }

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
            const getUserSpy = jest.spyOn(instance, "get").mockResolvedValue({
                data: UserStub()
            })
            const store = makeStore();
            await store.dispatch(getUser());
            expect(getUserSpy).toHaveBeenCalledWith("/auth/jwt");
            expect(store.getState().user.user).toEqual(UserStub());
            getUserSpy.mockClear();
        })

        it('should not fetch a user if user is not empty', async () => {
            const getUserSpy = jest.spyOn(instance, "get").mockResolvedValue({
                data: UserStub()
            })
            const store = makeStore();
            await store.dispatch(getUser());
            await store.dispatch(getUser());
            expect(getUserSpy).toHaveBeenCalledTimes(1);
        })

        it('should fetch a user and execute the callback if user state is empty', async () => {
            const user = UserStub();
            const getUserSpy = jest.spyOn(instance, "get").mockResolvedValue({
                data: user
            })
            const store = makeStore();
            const fn = jest.fn();
            await store.dispatch(getUser(fn));
            expect(getUserSpy).toHaveBeenCalledWith("/auth/jwt");
            expect(store.getState().user.user).toEqual(user);
            expect(fn).toHaveBeenCalledWith(user._id);
        })

    });

    describe('Logout', function () {
        it('should reset the user (action)', async () => {
            const logoutSpy = jest.spyOn(instance, "get").mockResolvedValue({});
            const store = makeStore();
            await store.dispatch(logout());
            expect(logoutSpy).toHaveBeenCalledWith("/auth/logout");
            expect(store.getState().user.user).toEqual({});
        })
        it('should reset the user (reducer)', async () => {
            const action: AnyAction = {type: logout.fulfilled};
            const state = userReducer({
                ...initialState,
                user: UserStub()
            }, action);
            expect(state).toEqual({
                ...initialState,
                user: {}
            });
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
            const action: AnyAction = {type: updateLoggedUser.pending};
            const state = userReducer(initialState, action);
            expect(state).toEqual({
                ...initialState,
                pending: true
            })
        })

        it('should set pending false and not set error to true (unused error)', () => {
            const action: AnyAction = {type: updateLoggedUser.rejected};
            const state = userReducer(initialState, action);
            expect(state).toEqual(initialState);
        })

        it('should replace the user and pending false', () => {
            const action: AnyAction = {type: updateLoggedUser.fulfilled, payload: UserStub()};
            const state = userReducer({
                ...initialState, pending: true
            }, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                user: UserStub()
            });
        })

        it('should fetch the updated user', async () => {
            const user = UserStub();
            const getUserSpy = jest.spyOn(instance, "patch").mockResolvedValue({
                data: user
            })
            const store = makeStore();
            const data = {_id: user._id};
            await store.dispatch(updateLoggedUser(data));
            expect(getUserSpy).toHaveBeenCalledWith(`/users/${user._id}`, data);
            expect(store.getState().user.user).toEqual(UserStub());
        })
        it('should not update the user on failure', async () => {
            const user = UserStub();
            const errorData = {
                message: "message",
                code: 1,
                status: 400
            }
            const getUserSpy = jest.spyOn(instance, "patch").mockRejectedValue({
                response: {
                    data: errorData
                }
            })
            const store = makeStore();
            const data = {_id: user._id};
            await store.dispatch(updateLoggedUser(data)).then(res => {
                expect(res.payload).toBe(errorData);
            });
            expect(getUserSpy).toHaveBeenCalledWith(`/users/${user._id}`, data);
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
            const state = userReducer(initialState, action);
            expect(state).toEqual(initialState);
        })

        it('should replace the user\'s picture and pending false', () => {
            const action: AnyAction = {type: uploadPicture.fulfilled, payload: 'picture link'};
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

        it('should upload the profile picture', async () => {
            const user = UserStub();
            const getUserSpy = jest.spyOn(instance, "patch").mockResolvedValue({
                data: {
                    picture: "picture"
                }
            })
            const store = makeStore();
            const data = {_id: user._id, data: new FormData()};
            await store.dispatch(uploadPicture(data));
            expect(getUserSpy).toHaveBeenCalledWith(`/users/upload/${data._id}`, data.data);
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
            const state = userReducer(initialState, action);
            expect(state).toEqual(initialState);
        })

        it('should remove the profile picture from the user and pending false', () => {
            const action: AnyAction = {type: removePicture.fulfilled};
            const state = userReducer({
                ...initialState, pending: true, user: {...UserStub(), picture: 'picture'}
            }, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                user: UserStub()
            });
        })

        it('should remove the profile picture', async () => {
            const user = UserStub();
            const getUserSpy = jest.spyOn(instance, "delete").mockResolvedValue({})
            const store = makeStore();
            const data = user._id;
            await store.dispatch(removePicture(data));
            expect(getUserSpy).toHaveBeenCalledWith(`/users/upload/${user._id}`);
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
            const state = userReducer(initialState, action);
            expect(state).toEqual(initialState);
        })

        it('should delete the account and set pending false', () => {
            const action: AnyAction = {type: deleteAccount.fulfilled};
            const state = userReducer({
                ...initialState, pending: true, user: UserStub()
            }, action);
            expect(state).toEqual({
                ...initialState,
                pending: false,
                user: {}
            });
        })

        it('should delete the account', async () => {
            const user = UserStub();
            const getUserSpy = jest.spyOn(instance, "delete").mockResolvedValue({})
            const store = makeStore();
            const data = user._id;
            await store.dispatch(deleteAccount(data));
            expect(getUserSpy).toHaveBeenCalledWith(`/users/${user._id}`);
        })
    });

});