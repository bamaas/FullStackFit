

context('FitTrack', () => {

  before(() => {
    cy.task('cleanDatabase');
  })

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
    })
    
    it('post an entry', () => {
        const weight = (Math.floor(Math.random() * 99) + 1)
        const note  = Math.random().toString().substr(2, 8);
        const date = '2000-01-01T15:12:30'
        cy.get('@userId').then(userId => {
            cy.get('@accessToken').then(token => {
              cy.request({
                method: 'POST',
                url: '/api/entry',
                headers: {
                  'Authorization': 'Bearer ' + token
                },
                body: {
                  'weight': weight,
                  'date': date,
                  'note': note,
                  'userId': userId
                }
              })
            })
          }).then(response => {
              expect(response.body.weight).to.equal(weight);
              expect(response.body.note).to.equal(note);
              expect(response.body.id).to.exist;
              expect(response.body.date).to.equal(date);
          })
    });

    it('get an entry', () => {
      cy.get('@accessToken').then(token => {
          cy.request({
              method: 'GET',
              url: Cypress.env('entry_url') + '?pageNumber=0&pageSize=28',
              headers: {
                  'Authorization': 'Bearer ' + token
              }
          }).then(response => {
              expect(response.body[0].weight).to.be.a('number');
              expect(response.body[0].note).to.be.a('string');
              expect(response.body[0].id).to.to.be.a('number')
              expect(response.body[0].date).to.be.a('string');
            }) 
      });
    });

    // it('delete an entry', () => {

    // });

    // it('edit an entry', () => {
    // });
  
  })
  