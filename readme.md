[![Semaphore Status](https://Bamaas.semaphoreci.com/badges/FullStackFit/branches/master.svg?style=shields)](https://bamaas.semaphoreci.com/projects/FullStackFit/)
[![BrowserStack Status](https://automate.browserstack.com/badge.svg?badge_key=SFlpQ0s5WW1GaWlJYjVjL3R4TGpRZHBUei9lY1J5Sng5QnY3NjdQSlhSQT0tLW5vY1FwamkyTituZDRldG1DOG0wNXc9PQ==--9bfa6e5f0a81668369f9ebb1ba200bc64ef3191f)](https://automate.browserstack.com/public-build/SFlpQ0s5WW1GaWlJYjVjL3R4TGpRZHBUei9lY1J5Sng5QnY3NjdQSlhSQT0tLW5vY1FwamkyTituZDRldG1DOG0wNXc9PQ==--9bfa6e5f0a81668369f9ebb1ba200bc64ef3191f)
![Uptime Robot ratio (30 days)](https://img.shields.io/uptimerobot/ratio/m784599266-50bceabcc776dda1320c0df8?label=Uptime)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=bamaas_FullStackFit&metric=alert_status)](https://sonarcloud.io/dashboard?id=bamaas_FullStackFit)

# Fulltackfit project - Bas Maas

Prod deployed @ [fit.basmaas.nl](https://fit.basmaas.nl) (Running on Kubernetes @ My Home)

Test deployed @ [test.fit.basmaas.nl](https://test.fit.basmaas.nl) (Running on Kubernetes @ My Home)

### What is this application about?
In my free time I like to be in the gym and move some weights. For years I keep track of my body weight in an Excel sheet, every day. At the end of a week I calculate the average of that week and compare it with the previous week, so I can determine if I lost or gained weight. I thought it would be nice to build a web application to replace the Excel sheet.

### Technology stack
- Frontend: Typescript, Angular.
- Backend: Java, Spring Boot.
- Database: PostgreSQL.
- Test: Python, Robot Framework.
- CI/CD @ [Semaphore](https://bamaas.semaphoreci.com/projects/FullStackFit/)
- Container Registry @ [DockerHub](https://hub.docker.com/u/bamaas)
- Uptime Monitoring @ [Uptime Robot](https://stats.uptimerobot.com/zp8vnhRRwy)
- E2E Test Reports (latest build only) @ [BrowserStack](https://automate.browserstack.com/public-build/SFlpQ0s5WW1GaWlJYjVjL3R4TGpRZHBUei9lY1J5Sng5QnY3NjdQSlhSQT0tLW5vY1FwamkyTituZDRldG1DOG0wNXc9PQ==--9bfa6e5f0a81668369f9ebb1ba200bc64ef3191f)
- Code Quality & Security @ [Sonarcloud](https://sonarcloud.io/dashboard?id=bamaas_FullStackFit)

### Top 3 features I'm proud of

#### 1. The enitre development to deployment process is automated. 
Commits pushed to the dev branch automatically opens a pull request and triggers a build of the pipeline. If all checks in the pipeline passes the pull request is merged into master. From here on we have a new master version that needs to be tested. If everything passes, a deployment pipeline is started. At the end of the deployment a small smoke test runs to validate that the deployment was successful.

#### 2. The application is hosted at my home running on a Kubernetes cluster.
I have an Intel NUC running at my home with Proxmox installed; a server virtualization management platform. I've created several virtual machines with Ubuntu. One of these nodes is running a Kubernetes cluster. On this cluster I've deployed a development and production environment of the application.

#### 3. Mobile first approach.
Because I'm going to use this application on my phone I want it to be compatible with mobile devices. That's why I design this with a mobile-first approach and thus it needs to be tested on mobile devices. Before a new version is deployed to production it is first being e2e tested. During these e2e tests Selenium connects with a node from Browserstack where the tests are being executed on real mobile devices. These tests are [recorded](https://automate.browserstack.com/public-build/SFlpQ0s5WW1GaWlJYjVjL3R4TGpRZHBUei9lY1J5Sng5QnY3NjdQSlhSQT0tLW5vY1FwamkyTituZDRldG1DOG0wNXc9PQ==--9bfa6e5f0a81668369f9ebb1ba200bc64ef3191f).

## Run locally
Run the following command to run the latest release of the application. Be sure `make` is installed.

`make latest`

This will start the application on `http://localhost:80`.

### Backlog
1. Frontend view for displaying the weekly averages and the delta.

## License
[MIT](https://github.com/bamaas/FullStackFit/blob/master/LICENSE.md)