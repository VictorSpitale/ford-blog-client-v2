import {NextRouter} from "next/router";

export function MockUserRouter(router: Partial<NextRouter>): NextRouter {
    return {
        basePath: "",
        pathname: "/",
        route: "/",
        query: {},
        asPath: "/",
        back: jest.fn(),
        beforePopState: jest.fn(),
        prefetch: jest.fn(),
        push: jest.fn().mockResolvedValue(true),
        reload: jest.fn(),
        replace: jest.fn(),
        events: {
            on: jest.fn(),
            off: jest.fn(),
            emit: jest.fn(),
        },
        isFallback: false,
        isLocaleDomain: false,
        isReady: true,
        defaultLocale: 'fr',
        locale: undefined,
        domainLocales: [],
        isPreview: false,
        ...router
    }
}