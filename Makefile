.PHONY: dev build-prod test shutdown restart dev-fe dev-be dev-db dev-proxy reload-nginx test-e2e test-ws deploy-prod

shutdown:
	docker-compose down

restart:
	docker-compose restart

# DEV
dev:
	docker-compose -f docker-compose-dev.yml build
	docker-compose -f docker-compose-dev.yml up

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
	make test-unit
	make test-ws
	make test-e2e

test-unit:
	python3 "./backend/unit tests/test_calculations.py"

test-ws:
	docker-compose -f docker-compose-test.yml run --rm test -d logs testsuites/ws.robot

test-e2e:
	docker-compose -f docker-compose-test.yml run --rm test -d logs testsuites/gui.robot

# PROD
prod:
	docker-compose -f docker-compose-prod.build.yml build
	docker-compose -f docker-compose-prod.build.yml up -d

# LATEST
latest:
	docker-compose down
	docker-compose rm -f
	docker-compose -f docker-compose-run-latest.yml build --pull
	docker-compose -f docker-compose-run-latest.yml up -d