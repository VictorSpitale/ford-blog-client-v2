import {render, screen} from "@testing-library/react";
import AccountView from "../../../../components/account/AccountView";
import {MockUseRouter} from "../../../utils/MockUseRouter";
import {RouterContext} from "next/dist/shared/lib/router-context";
import {AccountViews} from "../../../../shared/types/accountViews.type";
import * as fr from '../../../../public/static/locales/fr.json'
import {Provider} from "react-redux";
import {makeStore} from "../../../../context/store";
import {queryByContent} from "../../../utils/CustomQueries";
import {UserStub} from "../../../stub/UserStub";
import * as fetch from "../../../../context/instance";
import * as hooks from "../../../../context/hooks";

describe('AccountView', function () {

    beforeEach(() => {
        jest.mock('../../public/static/img/default-profile.png');
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should render the Account View base', function () {

        const router = MockUseRouter({});

        render(
            <Provider store={makeStore()}>
                <RouterContext.Provider value={router}>
                    <AccountView view={null as unknown as AccountViews}
                                 authUser={{} as never}
                    />
                </RouterContext.Provider>
            </Provider>
        )
        expect(screen.queryByText(fr.account.title));
    });

    it('should render the Account Likes View', function () {

        const router = MockUseRouter({});
        const user = UserStub();

        jest.spyOn(fetch, "fetchApi").mockResolvedValueOnce({data: []})

        jest.spyOn(hooks, "useAppSelector").mockReturnValue({
            users: [],
            pending: false
        });

        render(
            <Provider store={makeStore()}>
                <RouterContext.Provider value={router}>
                    <AccountView view={AccountViews.LIKES}
                                 authUser={{user, pending: false}}
                    />
                </RouterContext.Provider>
            </Provider>
        )
        expect(queryByContent("view-title").textContent).toEqual(fr.account.viewsName.LIKES);
    });

    it('should render the Account Profile View', function () {

        const router = MockUseRouter({});
        const store = makeStore();

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <AccountView view={AccountViews.PROFILE}
                                 authUser={{user: UserStub(), pending: false}}
                    />
                </RouterContext.Provider>
            </Provider>
        )
        expect(queryByContent("view-title").textContent).toEqual(fr.account.profile.title);
    });

    it('should render the Account Security View', function () {

        const router = MockUseRouter({});

        render(
            <Provider store={makeStore()}>
                <RouterContext.Provider value={router}>
                    <AccountView view={AccountViews.SECURITY}
                                 authUser={{user: UserStub(), pending: false}}
                    />
                </RouterContext.Provider>
            </Provider>
        )
        expect(queryByContent("view-title").textContent).toEqual(fr.account.security.title);
    });

});