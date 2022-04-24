/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
        isInView(subject: JQuery<Element>): void;
    }
}