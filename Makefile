#Makefile -> should modify for docker-compose version later

.PHONY: reset stop prune build run exec

stop:
	@if [ -n "$$(docker ps -q)" ]; then docker stop $$(docker ps -q); fi

prune:
	docker system prune -af

# Build a docker image:
# - with the name/tag (-t) 'backend'
# - from the dockerfile in the path 'backend'
# - and rebuild everything from scratch, without using cached layers (--no-cache)
build:
	docker build --no-cache -t backend backend

# Run a docker container:
# - from the image named 'backend'
# - map the ports 3000 of localhost to 3000 of container (-p)
run:
	docker run --name backend -p 127.0.0.1:3000:3000 backend

# Execute a command in a running container:
# - opening an interactive terminal session inside the container (-it)
# - running a shell (sh)
# exec should be executed when the container is already running	
exec:
	docker exec -it backend sh
	
clean: stop prune

reset: stop prune build run
