context('FitTrack', () => {

  beforeEach(() => {
    cy.getAccessToken(Cypress.env('username'), Cypress.env('password')).then(accessToken => {
      cy.getUserId(accessToken).then(userId => {
        cy.task('db:clean', userId);
      })
    })
  })
    
    it(['regression'], 'post an entry', () => {
      const weight = (Math.floor(Math.random() * 99) + 1)
      const note  = Math.random().toString().substr(2, 8);
      const year = '10' + (Math.floor(Math.random() * 10)).toString() + (Math.floor(Math.random() * 10)).toString()
      const date = `${year}-01-01T15:1${(Math.floor(Math.random() * 10))}`;
      cy.get('@userId').then(userId => {
          cy.get('@accessToken').then(token => {
            cy.fixture('entry.json').then(body => {
              body.note = note;
              body.date = date;
              body.weight = weight;
              cy.request({
                method: 'POST',
                url: Cypress.env('backend_url') + '/entry',
                headers: {
                  'Authorization': 'Bearer ' + token
                },
                body: body
              })
            })
          })
        }).then(response => {
            expect(response.body.weight).to.equal(weight);
            expect(response.body.note).to.equal(note);
            expect(response.body.id).to.exist;
            expect(response.body.date).to.equal(date);
        })
        cy.get('@userId').then(userId => {
          cy.task('db:getAllEntries', userId).then(rows => {
            expect(rows[0].weight).to.equal(weight);
            expect(rows[0].note).to.equal(note);
            expect(rows[0].id).to.exist;
            expect((rows[0].date).split('T')[0]).to.equal(date.split('T')[0]);
            expect(rows[0].user_id).to.equal(userId);
            expect(rows[0].year).to.equal(Number(date.split('-')[0]));
            expect(rows[0].week).to.equal(0);
          })
        })
    });

    it(['regression'], 'get entry page', () => {
      cy.get('@userId').then(userId => {
        cy.task('db:insertEntry', userId)
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
              expect(response.body[0].weight).to.be.a('number');
              expect(response.body[0].note).to.be.a('string');
              expect(response.body[0].id).to.to.be.a('number');
              expect(response.body[0].date).to.be.a('string');
            }) 
      });

    });

    it(['regression'], 'get single entry', () => {
      cy.get('@userId').then(userId => {
        cy.task('db:insertEntry', userId).then
        cy.task('db:getAllEntries', userId).then(result => {
          const entryId = result[0].id;
          cy.get('@accessToken').then(token => {
            cy.request({
                method: 'GET',
                url: Cypress.env('backend_url') + '/entry/' + entryId,
                headers: {
                    'Authorization': 'Bearer ' + token
                }
              }).then(response => {
                expect(response.body.weight).to.be.a('number');
                expect(response.body.note).to.be.a('string');
                expect(response.body.id).to.to.be.a('number')
                expect(response.body.date).to.be.a('string');
              }) ;
          });
        });
      });
    });

    it(['regression'], 'delete entry', () => {
      cy.get('@userId').then(userId => {
        cy.task('db:insertEntry', userId)
      })

      cy.get('@userId').then(userId => {
        cy.task('db:getAllEntries', userId).then(result => {
          const entryId = result[0].id;
          cy.get('@accessToken').then(token => {
            cy.request({
              method: 'DELETE',
              url: Cypress.env('backend_url') + `/entry/${entryId}`,
              headers: {
                  'Authorization': 'Bearer ' + token
              }
            }).then(response => {
              cy.task('db:getAllEntries', userId).then(result => {
                cy.wrap(result).should('have.length', 0)
              })
            })
          })
        })
      })

    });

    it(['regression'], 'edit entry', () => {
      cy.get('@userId').then(userId => {
        cy.task('db:insertEntry', userId)
      })

      cy.get('@userId').then(userId => {
        cy.task('db:getAllEntries', userId).then(rows => {
          cy.wrap(rows[0].id).as('entryId')
        })
      })

      const weight = (Math.floor(Math.random() * 99) + 1)
      const note  = Math.random().toString().substr(2, 8);
      const year = '10' + (Math.floor(Math.random() * 10)).toString() + (Math.floor(Math.random() * 10)).toString()
      const date = `${year}-01-01T15:1${(Math.floor(Math.random() * 10))}`;

      cy.get('@entryId').then(entryId => {
        cy.get('@userId').then(userId => {
            cy.get('@accessToken').then(token => {
                cy.fixture('entry.json').then(body => {
                  body.note = note;
                  body.date = date;
                  body.weight = weight;
                  body.id = entryId;
                  cy.request({
                    method: 'PUT',
                    url: Cypress.env('backend_url') + '/entry',
                    headers: {
                      'Authorization': 'Bearer ' + token
                    },
                    body: body
                  })
                })
            })
          }).then(response => {
              expect(response.body.weight).to.equal(weight);
              expect(response.body.note).to.equal(note);
              expect(response.body.id).to.exist;
              expect(response.body.date).to.equal(date);
          })
      })

      cy.get('@entryId').then(entryId => {
        cy.get('@userId').then(userId => {
          cy.task('db:getAllEntries', userId).then(rows => {
            expect(rows[0].id).to.equal(entryId)
            expect(rows[0].weight).to.equal(weight);
            expect(rows[0].note).to.equal(note);
            expect((rows[0].date).split('T')[0]).to.equal(date.split('T')[0]);
            expect(rows[0].user_id).to.equal(userId);
            expect(rows[0].year).to.equal(Number(date.split('-')[0]));
            expect(rows[0].week).to.equal(0);
          })
        })
      })

    });
  
  })
  