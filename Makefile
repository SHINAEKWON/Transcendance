.PHONY: prune build up down buildup execfe execbe clean reset

prune:
	docker system prune -af

build:
	docker-compose build --no-cache

up:
	docker-compose up

down:
	docker-compose down

buildup: build up

execfe:
	docker exec -it front sh

execbe:
	docker exec -it back sh

rmvol:
	docker volume rm $$(docker volume ls -q)
	
clean: down prune

reset: clean buildup
