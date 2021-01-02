// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
Cypress.Commands.add(
    'login', (username, password) => {
        cy.visit('/')
        cy.get('#username').type(username).should('have.value', username)
        cy.get('#password').type(password).should('have.value', password)
        cy.get('.submit').click();
        cy.get('[test=username]').should('exist').contains(username.charAt(0).toUpperCase() + username.slice(1));
    }
)

Cypress.Commands.add(
    'refresh', () => {
        cy.get('[test=username]').invoke('text').then(username => {
            cy.visit('/')
            cy.get('[test=username]').should('exist').contains(username);
        })
    }
)

Cypress.Commands.add(
    'logout', () => {
        cy.get('[test=header-menu]').click();
        cy.get('[test=username').click();
        cy.contains('Sign out').click();
        cy.get('#username').should('be.visible')
    }
)