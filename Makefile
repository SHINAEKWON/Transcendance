# this is a Makefile to handle the docker container which compiles the game

.PHONY: reset stop prune build run exec

stop:
	@if [ -n "$$(docker ps -q)" ]; then docker stop $$(docker ps -q); fi

prune:
	docker system prune -af

# Build a docker image:
# - with the name/tag (-t) 'game'
# - from the dockerfile in the path 'game'
# - and rebuild everything from scratch, without using cached layers (--no-cache)
build:
	docker build --no-cache -t game game

# Run a docker container:
# - from the image named 'game'
# - map the ports 3000 of localhost to 3000 of container (-p)
run:
	docker run --name game -p 127.0.0.1:3000:3000 game

# Execute a command in a running container:
# - opening an interactive terminal session inside the container (-it)
# - running a shell (sh)
# exec should be executed when the container is already running
exec:
	docker exec -it game sh

ls:
	docker image ls

ps:
	docker ps -a
	
clean: stop prune

reset: stop prune build run
