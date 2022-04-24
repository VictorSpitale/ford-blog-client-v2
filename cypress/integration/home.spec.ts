/// <reference types="cypress" />

import {IPost} from "../../shared/types/post.type";

context('Home Page', () => {

    const apiUrl = Cypress.env('apiUrl');
    before(() => {
        cy.intercept({
            method: "GET",
            url: `${apiUrl}/categories`
        }, []).as('categories')
        cy.intercept({
            method: "GET",
            url: `${apiUrl}/auth/jwt`
        }, {statusCode: 404}).as('jwt')
        cy.task("mockServer", {interceptUrl: `${apiUrl}/posts/last`, fixture: 'lastPosts.json'})
        cy.visit('http://localhost:3000')
    })
    beforeEach(() => {
        cy.get('.Navbar_select_language__kefFL').should("be.visible").as('flag');
        cy.get('.Navbar_nav_opener_button__K20mv').should('be.visible').as('menu');
    })

    it('should display the header nav', () => {
        cy.get('img[alt="Ford Universe Logo"]').should('be.visible');
        cy.get('img[alt="Ford Universe"]').should('be.visible');
    })

    it('should display 6 posts', () => {
        for (let i = 1; i <= 6; i++) {
            cy.get(`.Loading_content_container__pGjBz > div > div:nth-child(${i})`)
        }
    })

    it('should display the post\'s categories', () => {
        cy.get(':nth-child(1) > .py-2 > .flex-wrap > .justify-between > .box-border > #Sport')
        cy.get(':nth-child(2)').contains('+ 1')
    })

    it('should display the languages available', () => {
        cy.get('@flag').children('ul').should('not.be.visible');
        cy.get('.Navbar_select_language__kefFL').realHover();
        cy.get('@flag').children('ul').then(res => {
            cy.isInView(res);
        })
    })

    it('should change the language', () => {
        cy.get(`.Loading_content_container__pGjBz > div > div:nth-child(1)`).contains('Lire la suite')
        cy.get('.Navbar_select_language__kefFL').realHover();
        cy.get('.Navbar_select_language__kefFL > ul > li > div').click()
        cy.get(`.Loading_content_container__pGjBz > div > div:nth-child(1)`).contains('Read more')
        cy.location('pathname').should('include', 'en')
    })

    it('should open and close the menu', () => {
        cy.get('.Navbar_nav_content__LgZ4a').as('menuContent').should('not.be.visible')
        cy.get('@menu').click();
        cy.get('@menuContent').should('be.visible')
        cy.get('.Navbar_nav_close_btn__kZNuL').click();
        cy.get('@menuContent').should('be.not.visible')
    })

    it('should open the menu and contains the good links', () => {
        cy.get('.Navbar_nav_content__LgZ4a').as('menuContent').should('not.be.visible')
        cy.get('@menu').click();
        cy.get('@menuContent').should('be.visible')
        cy.get('.Navbar_nav_content__LgZ4a').as('links')
        cy.get('@links').then(res => {
            expect(res).to.not.contain.text('Poster')
            expect(res).to.contain.text('Contact')
        })
    })

    it('should close the menu with espace', () => {
        cy.get('@menu').type('{esc}')
        cy.get('.Navbar_nav_content__LgZ4a').as('menuContent').should('not.be.visible')
    })

    it('should have post links', () => {
        cy.fixture('lastPosts.json').then(res => {
            const lastPosts = res as IPost[];
            cy.get(`.Loading_content_container__pGjBz > div > div:nth-child(1) a.bg-primary-400`)
                .as('link').should('have.attr', 'href').should('contain', lastPosts[0].slug)
        })
    })

})