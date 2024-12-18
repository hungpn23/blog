# Nestjs blog

A nestjs blog project

## Libraries & frameworks

Nestjs, Typeorm (Mysql), Swagger, Pino

## Installation

```bash
# Initialize
git clone https://github.com/hungpn23/blog.git
cd blog
cp .env.example .env
pnpm install

# Docker
docker pull mysql:8.0
docker compose up -d

# MySQL replication
docker exec -it master mysql -uroot -ppassword
show master status;
# copy content in File and Position column
# paste into master_log_file & master_log_pos in replication.sql
quit
docker exec -it slave mysql -uroot -ppassword
# copy content in replication.sql and paste into terminal
start slave;
show slave status\G;
# Slave_IO_Running: Yes --> OK
# Slave_SQL_Running: Yes --> OK
quit

# Seed database
pnpm db:create
pnpm seed:run

# Start application
pnpm start:dev
```

## Checklist

Change configurations in `.env` (optional)

## Related

[vndevteam](https://github.com/vndevteam/nestjs-boilerplate)
