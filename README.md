# NestJS Blog

A NestJS blog project.

## Libraries & Frameworks

- NestJS
- TypeORM (MySQL)
- Swagger
- Pino

## Installation

### Initialize

```bash
git clone https://github.com/hungpn23/blog.git
cd blog
cp .env.example .env
pnpm install
```

### Docker

```bash
docker pull mysql:8.0
docker compose up -d
```

### MySQL Replication

```bash
docker exec -it mysql_master mysql -uroot -ppassword
```

Run the following commands in the MySQL shell:

```sql
SHOW MASTER STATUS;
```

Copy the content in the `File` and `Position` columns and paste it into `master_log_file` & `master_log_pos` in `replication.sql`. Then, quit the MySQL shell:

```bash
quit
```

Next, run the following command:

```bash
docker exec -it mysql_slave mysql -uroot -ppassword
```

Copy the content in `replication.sql` and execute it in the MySQL shell.
