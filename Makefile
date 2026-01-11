.PHONY: help install dev build start stop clean docker-build docker-up docker-down

help:
	@echo "Available commands:"
	@echo "  make install       - Install all dependencies"
	@echo "  make dev           - Start development servers"
	@echo "  make build         - Build all applications"
	@echo "  make docker-build  - Build Docker images"
	@echo "  make docker-up     - Start Docker containers"
	@echo "  make docker-down   - Stop Docker containers"
	@echo "  make clean         - Clean all build artifacts"

install:
	pnpm install

dev:
	pnpm dev

build:
	pnpm build

docker-build:
	docker-compose build

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

clean:
	pnpm clean
	cd backend && ./gradlew clean
	docker-compose down -v

backend-dev:
	cd backend && ./gradlew bootRun

web-dev:
	pnpm --filter web dev

admin-dev:
	pnpm --filter admin dev

mobile-dev:
	pnpm --filter mobile dev
