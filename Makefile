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
	docker exec -it front bash

execauth:
	docker exec -it auth bash

execuser:
	docker exec -it user bash

execgame:
	docker exec -it game bash

execchat:
	docker exec -it chat bash

execgate:
	docker exec -it gateway bash
	
lauth:
	docker logs auth

luser:
	docker logs user

lgame:
	docker logs game

lchat:
	docker logs chat

lgate:
	docker logs gateway

lfront:
	docker logs front

rmvol:
	docker volume rm $$(docker volume ls -q)
	
clean: down prune

reset: clean buildup
