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

# Execute a command in a running container:
# - opening an interactive terminal session inside the container (-it)
# - running a shell (bash)
# exec should be executed when the container is already running
execfe:
	docker exec -it frontend bash

ls:
	docker image ls

ps:
	docker ps -a

clean: down prune

reset: clean run