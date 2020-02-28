.PHONY: build push login

NAME:= bamaas/fullstackfit_database
IMG:= $(NAME):$(TAG)
TAG=$(git rev-parse --short HEAD)
LATEST:=$(NAME):latest
 
build:
	echo $(IMG):$(TAG)

	  @docker build -t ${IMG} .
  	  @docker tag ${IMG} ${LATEST}
 
push:
	@docker push ${NAME}
 
login:
	@docker log -u ${DOCKER_USER} -p ${DOCKER_PASS}