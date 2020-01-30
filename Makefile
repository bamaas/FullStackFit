.PHONY: dev prod test shutdown

dev:
	docker-compose -f docker-compose-dev.yml build
	docker-compose -f docker-compose-dev.yml up

prod:
	docker-compose -f docker-compose-prod.yml build
	docker-compose -f docker-compose-prod.yml up -d

test:
	docker-compose -f docker-compose-test.yml up

shutdown:
	docker-compose down

restart:
	docker-compose restart