

context('FitTrack', () => {

  before(() => {
    cy.login(Cypress.env('username_test'), Cypress.env('password_test'))
  });

  after(() => {
    cy.logout();
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce(
      'KEYCLOAK_SESSION_LEGACY', 
      'KEYCLOAK_SESSION', 
      'KEYCLOAK_IDENTITY_LEGACY', 
      'AUTH_SESSION_ID_LEGACY', 
      'KEYCLOAK_IDENTITY', 
      'JSESSIONID', 
      'AUTH_SESSION_ID'
    )
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
          cy.task('db:clean', response.body.sub);
          cy.wrap(response.body.sub).as('userId')
        });
      })
  })


  it('edit entry', () => {
    const weight = (Math.floor(Math.random() * 99) + 1).toString()
    cy.get('@userId').then(userId => {
      cy.task('db:insertEntry', userId)
    })
    cy.refresh();
    cy.xpath(`//mat-icon[text()='more_vert']`).click();
    cy.xpath(`//mat-icon[text()='edit']`).click();
    cy.get('#add-entry-input-weight').clear().type(weight);
    cy.get('#add-entry-btn-add').click();
    cy.contains(weight + ' kg').should('be.visible');
  });

  it('post entry', () => {
    const weight = (Math.floor(Math.random() * 99) + 1).toString()
    cy.get('[test=add-entry]').click();
    cy.get('#add-entry-input-weight').type(weight);
    cy.get('#add-entry-input-date').type('20-15-2020');
    cy.get('#add-entry-input-note').type('test note');
    cy.get('#add-entry-btn-add').click();
    cy.contains(weight).should('be.visible')
  })

  it('delete entry', () => {
    cy.get('@userId').then(userId => {
      cy.task('db:insertEntry', userId).then(entry => {
        cy.wrap(entry.weight).as('entryWeight');
      })
    })
    cy.refresh();
    cy.get('@entryWeight').then(weight => {
    cy.xpath(`//table[@id='entries-table']//tr[td[2][normalize-space(.)='${weight} kg']]//mat-icon[text()='more_vert']`).click();
    cy.xpath(`//mat-icon[text()='delete']`).click();
    cy.xpath(`//span[text()='Delete']`).click();
    cy.contains(weight + ' kg').should('not.exist');
    })
  });

})
