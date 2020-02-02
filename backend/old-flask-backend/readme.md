How to deploy to Heroku:
1. Build (locally) and push: heroku container:push web --app boiling-eyrie-96341
2. Deploy: heroku container:release web --app boiling-eyrie-96341
3. See logs: heroku logs --tail --app boiling-eyrie-96341

test