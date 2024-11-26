# Nestjs blog

A nestjs blog project

## Tech stack

Nestjs, MySQL

## Installation

```bash
# Clone the repository
git clone https://github.com/hungpn23/blog.git

cd blog

# Create environment variables file.
cp .env.example .env

# Install dependences.
pnpm install

# Docker
docker pull mysql:9.1

docker compose up -d

# Start
pnpm start:dev
```

## Checklist

Change configurations in `.env`

## Related

[vndevteam](https://github.com/vndevteam/nestjs-boilerplate)
