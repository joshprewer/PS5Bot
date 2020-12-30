rebuild:
	docker-compose kill
	docker-compose down --remove-orphans
	docker-compose build

install-dependencies:
	npm install

start: install-dependencies rebuild
	docker-compose up --exit-code-from start start
