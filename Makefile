.PHONY: dev prod test shutdown restart dev-fe dev-be dev-db dev-proxy reload-nginx test test-e2e test-ws

dev:
	docker-compose -f docker-compose-dev.yml build
	docker-compose -f docker-compose-dev.yml up

prod:
	docker-compose -f docker-compose-prod.yml build
	docker-compose -f docker-compose-prod.yml up -d

shutdown:
	docker-compose down

restart:
	docker-compose restart

# DEV

dev-fe:
	docker-compose -f docker-compose-dev.yml build frontend
	docker-compose -f docker-compose-dev.yml up frontend

dev-be:
	docker-compose -f docker-compose-dev.yml build backend
	docker-compose -f docker-compose-dev.yml up backend

dev-db:
	docker-compose -f docker-compose-dev.yml build database
	docker-compose -f docker-compose-dev.yml up database

dev-proxy:
	docker-compose -f docker-compose-dev.yml build reverseproxy
	docker-compose -f docker-compose-dev.yml up reverseproxy

reload-nginx:
	docker exec -it fit_reverseproxy-dev nginx -s reload

# TEST

test:
	docker-compose -f docker-compose-test.yml run --rm test -d logs testsuites

test-e2e:
	docker-compose -f docker-compose-test.yml run --rm test -d logs testsuites/gui.robot

test-ws:
	docker-compose -f docker-compose-test.yml run --rm test -d logs testsuites/ws.robot