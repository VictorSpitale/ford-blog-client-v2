import {makeStore} from "../../../../context/store";
import {MockUseRouter} from "../../../utils/MockUseRouter";
import {Provider} from "react-redux";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {RouterContext} from "next/dist/shared/lib/router-context";
import ContactForm from "../../../../components/contact/ContactForm";
import {IUser} from "../../../../shared/types/user.type";
import {queryByContent} from "../../../utils/CustomQueries";
import * as fr from "../../../../public/static/locales/fr.json";
import {UserStub} from "../../../stub/UserStub";
import * as fetch from '../../../../context/instance'

describe('ContactFormTest', function () {

    let user: IUser;
    let pending: boolean;

    beforeEach(() => {
        user = {} as IUser;
        pending = false;
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should render the contact form', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <ContactForm user={user} pending={pending} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(queryByContent("name")).toBeInTheDocument()
        expect(queryByContent("email")).toBeInTheDocument()
        expect(queryByContent("message")).toBeInTheDocument()
        expect(screen.getByText(fr.common.send)).toBeInTheDocument()
    });

    it('should render the fields error', function () {
        const store = makeStore();
        const router = MockUseRouter({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <ContactForm user={user} pending={pending} />
                </RouterContext.Provider>
            </Provider>
        )

        const btn = screen.getByText(fr.common.send);
        fireEvent.click(btn);

        expect(screen.getByText(fr.contact.errors.fields)).toBeInTheDocument();
    });

    it('should render the contact form loading and fill the user values', function () {
        const store = makeStore();
        const router = MockUseRouter({});
        pending = true;
        user = UserStub();

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <ContactForm user={user} pending={pending} />
                </RouterContext.Provider>
            </Provider>
        )

        expect(screen.getByDisplayValue(user.pseudo)).toBeInTheDocument();
        expect(screen.getByDisplayValue(user.email)).toBeInTheDocument();
        expect(screen.getByText(fr.common.loading)).toBeInTheDocument()
    });

    it('should send the mail', async function () {
        const store = makeStore();
        const router = MockUseRouter({});
        user = UserStub();
        const spy = jest.spyOn(fetch, "fetchApi").mockResolvedValue({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <ContactForm user={user} pending={pending} />
                </RouterContext.Provider>
            </Provider>
        )
        const btn = screen.getByText(fr.common.send);
        const msgInput = screen.getByLabelText(fr.contact.fields.message);

        fireEvent.change(msgInput, {target: {value: "Mon message"}});
        fireEvent.click(btn);

        await waitFor(() => {
            expect(spy).toHaveBeenCalled();
            expect(screen.getByText(fr.contact.sent)).toBeInTheDocument();
        })

    });

    it('should fail to send the mail', async function () {
        const store = makeStore();
        const router = MockUseRouter({});
        user = UserStub();
        const spy = jest.spyOn(fetch, "fetchApi").mockRejectedValue({});

        render(
            <Provider store={store}>
                <RouterContext.Provider value={router}>
                    <ContactForm user={user} pending={pending} />
                </RouterContext.Provider>
            </Provider>
        )
        const msgInput = screen.getByLabelText(fr.contact.fields.message);
        const btn = screen.getByText(fr.common.send);

        fireEvent.change(msgInput, {target: {value: "Mon message"}});
        fireEvent.click(btn);

        await waitFor(() => {
            expect(spy).toHaveBeenCalled();
            expect(screen.getByText(fr.common.tryLater)).toBeInTheDocument();
        });

    });


});