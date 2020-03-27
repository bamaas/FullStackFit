.PHONY: shutdown restart clean-fe clean-be  test test-unit test-api test-e2e

# GENERAL
shutdown:
	docker-compose down

restart:
	docker-compose restart

clean:
	make clean-fe
	make clean-be

clean-fe:
	rm -rf ./frontend/dist/angu
	rm -rf ./frontend/node_modules

clean-be:
	rm -rf ./backend/env

lint-dockerfile:
	docker run --rm -i hadolint/hadolint < ${f}

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

dev-proxy-restart:
	docker exec -it fit_reverseproxy-dev nginx -s reload

# TEST
test:
	make test-unit
	sh ./test/testcontainer -v environment:localhost testsuites

test-unit:
	python3 "./backend/unit_tests/test_calculations.py"

test-api:
	sh ./test/testcontainer -v environment:localhost testsuites/ws.robot

test-e2e:
	sh ./test/testcontainer -v environment:localhost testsuites/gui.robot

# BUILD
build:
	docker-compose -f docker-compose-build.yml build

# DEPLOY LATEST RELEASE
latest:
	docker-compose -f docker-compose-deploy-latest.yml build --pull && docker-compose -f docker-compose-deploy-latest.yml up -d