context('FitTrack', () => {

    beforeEach(() => {
        cy.getAccessToken(Cypress.env('username'), Cypress.env('password')).then(accessToken => {
          cy.getUserId(accessToken).then(userId => {
            cy.task('db:clean', userId);
          })
        })
      })

      it(['regression'], 'must be authorized to search entries', () => {
        cy.request({
          method: 'GET',
          url: Cypress.env('backend_url') + `/entry/search`,
          failOnStatusCode: false,
          headers: {
            'Authorization': 'Bearer 123'
          },
        }).then(response => {
          expect(response.status).to.equal(401);
        })
      })

      it(['regression'], 'must be authorized to get statistics', () => {
        cy.request({
          method: 'GET',
          url: Cypress.env('backend_url') + `/weight/all`,
          failOnStatusCode: false,
          headers: {
            'Authorization': 'Bearer 123'
          },
        }).then(response => {
          expect(response.status).to.equal(401);
        })
      })
  
      it(['regression'], 'must be authorized to delete an entry', () => {
        cy.request({
          method: 'DELETE',
          url: Cypress.env('backend_url') + `/entry/123`,
          failOnStatusCode: false,
          headers: {
            'Authorization': 'Bearer 123'
          },
        }).then(response => {
          expect(response.status).to.equal(401);
        })
      })
  
      it(['regression'], 'must be authorized to get single entry', () => {
          cy.request({
            method: 'GET',
            url: Cypress.env('backend_url') + `/entry/1`,
            failOnStatusCode: false,
            headers: {
              'Authorization': 'Bearer 123'
            },
          }).then(response => {
            expect(response.status).to.equal(401);
          })
      })
  
      it(['regression'], 'must be authorized to update an entry', () => {
          cy.request({
            method: 'PUT',
            url: Cypress.env('backend_url') + `/entry/1`,
            failOnStatusCode: false,
            headers: {
              'Authorization': 'Bearer 123'
            },
          }).then(response => {
            expect(response.status).to.equal(401);
          })
      })
  
      it(['regression'], 'must be authorized to post an entry', () => {
        const weight = (Math.floor(Math.random() * 99) + 1)
        const note  = Math.random().toString().substr(2, 8);
        const year = '10' + (Math.floor(Math.random() * 10)).toString() + (Math.floor(Math.random() * 10)).toString()
        const date = `${year}-01-01T15:1${(Math.floor(Math.random() * 10))}`;
        cy.fixture('entry.json').then(body => {
          body.note = note;
          body.date = date;
          body.weight = weight;
          cy.request({
            method: 'POST',
            url: Cypress.env('backend_url') + `/entry`,
            failOnStatusCode: false,
            headers: {
              'Authorization': 'Bearer 123'
            },
            body: body
          }).then(response => {
            expect(response.status).to.equal(401);
          })
        })
      })

      it(['regression'], 'only get user bounded entries', () => {
        cy.get('@userId').then(userId => {
          cy.task('db:insertEntry', userId)
        })
  
        cy.getAccessToken(Cypress.env('username_secondary'), Cypress.env('password_secondary')).then(accessToken => {
          cy.getUserId(accessToken).then(userId => {
            cy.task('db:clean', userId);
          })
        })

        cy.get('@accessToken').then(token => {
            cy.request({
                method: 'GET',
                url: Cypress.env('backend_url') + '/entry/search',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'pageNumber': 0,
                    'pageSize': 28
                }
            }).then(response => {
                expect(response.body.length).to.equal(0);
              }) 
        });
  
      });

})