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

# BUILD
build:
	docker-compose -f docker-compose-build.yml build ${s}