rebuild:
	docker-compose kill
	docker-compose down --remove-orphans
	docker-compose build

install-dependencies:
	rm -rf dist && npm install && npm run build

start: install-dependencies rebuild
	docker-compose up --exit-code-from start start