

context('FitTrack', () => {

  before(() => {
    // cy.task('kubectl:forwardDB', 'test');
    // cy.task('db:createpool').then(pool => {
    //   cy.wrap(pool).as('pool')
    // })
  })

  after(() => {
    // cy.task('kubectl:kill');
    // cy.get('@pool').then(pool => {
    //   cy.task('db:endpool', pool)
    // })
  })

    beforeEach(() => {
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
        cy.wrap(response.body.access_token).as('accessToken')
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
    
    it(['regression'], 'post an entry', () => {
      const weight = (Math.floor(Math.random() * 99) + 1)
      const note  = Math.random().toString().substr(2, 8);
      const year = '1' + (Math.floor(Math.random() * 900) + 1).toString();
      const date = `${year}-01-01T15:12`;
      cy.get('@userId').then(userId => {
          cy.get('@accessToken').then(token => {
            cy.request({
              method: 'POST',
              url: Cypress.env('backend_url') + '/entry',
              headers: {
                'Authorization': 'Bearer ' + token
              },
              body: {
                'id': null,
                'weight': weight,
                'date': date,
                'note': note,
                'userId': userId,
                "skinfold": {
                  "biceps": null,
                  "triceps": null,
                  "abdominal": null,
                  "chest": null,
                  "thigh": null,
                  "calf": null
                },
                "circumference": {
                  "arm": null,
                  "leg": null,
                  "chest": null,
                  "calf": null,
                  "neck": null,
                  "waist": null
                }
              }
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
              url: Cypress.env('backend_url') + '/entry/page?pageNumber=0&pageSize=28',
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
      const year = '1' + (Math.floor(Math.random() * 900) + 1).toString();
      const date = `${year}-01-01T15:12`

      cy.get('@entryId').then(entryId => {
        cy.get('@userId').then(userId => {
            cy.get('@accessToken').then(token => {
                cy.request({
                  method: 'PUT',
                  url: Cypress.env('backend_url') + '/entry',
                  headers: {
                    'Authorization': 'Bearer ' + token
                  },
                  body: {
                    'id': entryId,
                    'weight': weight,
                    'date': date,
                    'note': note,
                    'userId': userId,
                    "skinfold": {
                      "biceps": null,
                      "triceps": null,
                      "abdominal": null,
                      "chest": null,
                      "thigh": null,
                      "calf": null
                    },
                    "circumference": {
                      "arm": null,
                      "leg": null,
                      "chest": null,
                      "calf": null,
                      "neck": null,
                      "waist": null
                    }
                  }
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
            expect(rows[0].weight).to.equal(weight);
            expect(rows[0].note).to.equal(note);
            expect(rows[0].id).to.equal(entryId)
            expect((rows[0].date).split('T')[0]).to.equal(date.split('T')[0]);
            expect(rows[0].user_id).to.equal(userId);
            expect(rows[0].year).to.equal(Number(date.split('-')[0]));
            expect(rows[0].week).to.equal(0);
          })
        })
      })

    });
  
  })
  