FROM cypress/included:6.2.0
RUN curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl"
RUN chmod +x ./kubectl
RUN mv ./kubectl /usr/local/bin/kubectl
COPY config /root/config
ENV KUBECONFIG=/root/config
WORKDIR /e2e
COPY ./cypress /e2e/cypress
COPY ./package.json /e2e/package.json
COPY ./package-lock.json /e2e/package-lock.json
COPY ./cypress.json /e2e/cypress.json
RUN npm install
ENTRYPOINT [ "cypress" ]