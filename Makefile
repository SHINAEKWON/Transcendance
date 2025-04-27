.PHONY: prune build up down run execfe ls ps clean reset

prune:
	docker system prune -af

build:
	docker-compose build --no-cache

up:
	docker-compose up 

down:
	docker-compose down 

run: build up

VOLUMES := $(shell docker volume ls -q)

rmvol:
	@if [ -n "$(VOLUMES)" ]; then \
		docker volume rm $(VOLUMES); \
	else \
		echo "No Docker volumes to remove"; \
	fi

# Execute a command in a running container:
# - opening an interactive terminal session inside the container (-it)
# - running a shell (bash)
# exec should be executed when the container is already running
execfrontend:
	docker exec -it frontend bash

execsignup:
	docker exec -it signup bash

ls:
	docker image ls

lsvol:
	docker volume ls

ps:
	docker ps -a

clean: down prune rmvol

reset: clean run