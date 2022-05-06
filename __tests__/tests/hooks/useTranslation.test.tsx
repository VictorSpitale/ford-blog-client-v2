import {render} from "@testing-library/react";
import {useTranslation} from "../../../shared/hooks";
import {RouterContext} from "next/dist/shared/lib/router-context";
import {MockUseRouter} from "../../utils/MockUseRouter";
import fr from '../../../public/static/locales/fr.json';
import en from '../../../public/static/locales/en.json';
import {Translation} from "../../../shared/hooks/useTranslation";
import {TestHook} from "../../utils/TestHook";

describe('UseTranslation', function () {

    let translation: Translation | undefined;
    beforeEach(() => {
        translation = undefined;
    })

    it('should return the fr translations', () => {
        const mockRouter = MockUseRouter({locale: "fr"});
        render(
            <RouterContext.Provider value={mockRouter}>
                <TestHook callback={() => {
                    translation = useTranslation();
                }} />
            </RouterContext.Provider>
        )
        expect(translation).toBeDefined();
        expect(translation).toEqual(fr);
    })

    it('should return the en translations', () => {
        const mockRouter = MockUseRouter({locale: "en"});
        render(
            <RouterContext.Provider value={mockRouter}>
                <TestHook callback={() => {
                    translation = useTranslation();
                }} />
            </RouterContext.Provider>
        )
        expect(translation).toBeDefined();
        expect(translation).toEqual(en)
    })

});