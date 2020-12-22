

context('FitTrack', () => {

  before(() => {
    cy.task('cleanDatabase')
  });

  beforeEach(() => {
    cy.request({
      method: 'POST',
      url: Cypress.env('token_url'),
      form: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: {
        client_id: 'fittrack-application',
        username: Cypress.env('username_test'),
        password: Cypress.env('password_test'),
        grant_type: 'password'
      }
    }).then(response => {
      cy.wrap(response).its('body.access_token').as('accessToken')
    });

    cy.get('@accessToken').then(token => {
      cy.request({
        method: 'GET',
        url: Cypress.env('userinfo_url'),
        headers:{
          'Authorization': 'Bearer ' + token
        }
        }).then(response => {
          cy.wrap(response.body.sub).as('userId')
        });
      })

    cy.visit('/')
    cy.get('#username').type('test').should('have.value', 'test')
    cy.get('#password').type('test').should('have.value', 'test')
    cy.get('.submit').click();
    cy.get('[test=username]').should('be.visible').contains('Test');
  })


  it('edit entry', () => {
    const random = (Math.floor(Math.random() * 99) + 1).toString()
    cy.get('@userId').then(userId => {
      cy.get('@accessToken').then(token => {
        cy.request({
          method: 'POST',
          url: Cypress.env('entry_url'),
          headers: {
            'Authorization': 'Bearer ' + token
          },
          body: {
            'weight': random,
            'date': '2000-01-01T15:12:30',
            'note': 'this is a test note',
            'userId': userId
          }
        })
      })
    })
    cy.visit('/');
    cy.get('[test=username]').should('be.visible').contains('Test');
    cy.xpath(`//table[@id='entries-table']//tr[td[1][normalize-space(.)='01-01-2000'] and td[2][normalize-space(.)='${random} kg']]//mat-icon[text()='more_vert']`).click();
    cy.xpath(`//mat-icon[text()='edit']`).click();
    cy.get('#add-entry-input-weight').clear().type(random);
    cy.get('#add-entry-btn-add').click();
    cy.contains(random + ' kg').should('be.visible');
  });

  it('post entry', () => {
    const random = (Math.floor(Math.random() * 99) + 1).toString()
    cy.get('[test=add-entry]').click();
    cy.get('#add-entry-input-weight').type(random);
    cy.get('#add-entry-input-date').type('20-15-2020');
    cy.get('#add-entry-input-note').type('test note');
    cy.get('#add-entry-btn-add').click();
    cy.contains(random).should('be.visible')
  })

  it('delete entry', () => {
    const random = (Math.floor(Math.random() * 99) + 1).toString()
    cy.get('@userId').then(userId => {
      cy.get('@accessToken').then(token => {
        cy.request({
          method: 'POST',
          url: Cypress.env('entry_url'),
          headers: {
            'Authorization': 'Bearer ' + token
          },
          body: {
            'weight': random,
            'date': '2000-01-01T15:12:30',
            'note': 'this is a test note',
            'userId': userId
          }
        })
      })
    })
    cy.visit('/');
    cy.get('[test=username]').should('be.visible').contains('Test');
    cy.xpath(`//table[@id='entries-table']//tr[td[1][normalize-space(.)='01-01-2000'] and td[2][normalize-space(.)='${random} kg']]//mat-icon[text()='more_vert']`).click();
    cy.xpath(`//mat-icon[text()='delete']`).click();
    cy.xpath(`//span[text()='Delete']`).click();
    cy.contains(random + ' kg').should('not.exist');
  });

  it('logout', () => {
    cy.get('[test=username]').click();
    cy.contains('Sign out').click();
    cy.get('#username').should('be.visible')
  })

})
