let sizes = ['iphone-6', 'macbook-16']
if (Cypress.env('VIEWPORT') === 'mobile'){
  sizes = ['iphone-6'];
} else if (Cypress.env('VIEWPORT') === 'desktop'){
  sizes = ['macbook-16']
}

context('FitTrack', () => {

  before(() => {
    cy.login(Cypress.env('username'), Cypress.env('password'))
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
      url: Cypress.env('auth_url') + Cypress.env('token_url'),
      form: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: {
        client_id: 'fittrack-application',
        username: Cypress.env('username'),
        password: Cypress.env('password'),
        grant_type: 'password'
      }
    }).then(response => {
      cy.wrap(response).its('body.access_token').as('accessToken')
    });

    cy.get('@accessToken').then(token => {
      cy.request({
        method: 'GET',
        url: Cypress.env('auth_url') + Cypress.env('userinfo_url'),
        headers:{
          'Authorization': 'Bearer ' + token
        }
        }).then(response => {
          cy.task('db:clean', response.body.sub);
          cy.wrap(response.body.sub).as('userId')
        });
      })
  })

  sizes.forEach((size) => {

    it(['regression'], `edit entry on ${size} screen`, () => {
      cy.viewport(size)
      const weight = (Math.floor(Math.random() * 99) + 1).toString()
      cy.get('@userId').then(userId => {
        cy.task('db:insertEntry', userId).then(entryBefore => {
          const weightBefore = entryBefore.weight;
          cy.refresh();
          cy.contains(weightBefore + ' kg').click();
          cy.xpath(`//mat-icon[text()='edit']`).click();
          cy.get('#add-entry-input-weight').clear().type(weight);
          cy.get('#add-entry-btn-add').click();
          cy.contains(weight + ' kg').should('be.visible');
        })
      })
    });

    it(['smoke', 'regression'], `post entry on ${size} screen`, () => {
      cy.viewport(size)
      cy.refresh();
      const weight = (Math.floor(Math.random() * 99) + 1).toString()
      const note  = Math.random().toString().substr(2, 8);
      cy.get('[test=add-entry]').click();
      cy.get('#add-entry-input-weight').type(weight);
      // date
      cy.get('#add-entry-input-date').click();
      cy.xpath("//div[contains(@class, 'mat-calendar-body-cell-content') and text() = '15']").click();
      // time
      cy.get("#add-entry-input-time").click();
      cy.xpath("//div[@class='clock-face']//span[text()=' 12 ']").click();
      cy.xpath("//button[@class='timepicker-button']//span[text()='Ok']").click();
      cy.get('#add-entry-input-note').type(note);
      cy.get('#add-entry-btn-add').click();
      cy.contains(weight).should('be.visible');
      cy.contains(note).should('be.visible');
    })

    it(['regression'], `delete entry on ${size} screen`, () => {
      cy.viewport(size)
      cy.get('@userId').then(userId => {
        cy.task('db:insertEntry', userId).then(entry => {
          cy.wrap(entry.weight).as('entryWeight');
        })
      })
      cy.refresh();
      cy.get('@entryWeight').then(weight => {
      cy.xpath(`//table[@id='entries-table']//tr[td[2][normalize-space(.)='${weight} kg']]`).click();
      cy.xpath(`//mat-icon[text()='delete']`).click();
      cy.xpath(`//span[text()='Delete']`).click();
      cy.contains(weight + ' kg').should('not.exist');
      })
    });
  })
})
