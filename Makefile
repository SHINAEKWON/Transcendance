#Makefile -> should modify for docker-compose version later

.PHONY: reset stop prune build run

stop:
	@if [ -n "$$(docker ps -q)" ]; then docker stop $$(docker ps -q); fi

prune:
	docker system prune -af

build:
	docker build --no-cache -t backend backend

run:
	docker run -p 127.0.0.1:3000:3000 backend

reset: stop prune build run