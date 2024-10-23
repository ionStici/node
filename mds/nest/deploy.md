# AWS EC2 Deployment

## Table of Contents

- [Deploying a NestJS App to AWS EC2](#deploying-a-nestjs-app-to-aws-ec2)

## Deploying a NestJS App to AWS EC2

### Deployment Strategy

1. **Creating an EC2 Instance:**

   - A new virtual machine (EC2) with Ubuntu will be created.
   - This instance will host both the **NestJS app** and the **PostgreSQL database**.

2. **Installing Dependencies:**

   - **Node.js** for running the NestJS application.
   - **PostgreSQL** for managing the database.
   - **Nginx** for handling web traffic and acting as a reverse proxy.

### Role of Nginx

- **Web Server & Reverse Proxy:** Nginx will forward external requests (from the internet) to the NestJS application running on a specific port (e.g. port 3000).
- **Reverse Proxy Functionality:**
  - Requests arriving on port 80 or 443 (if using SSL) are routed by Nginx to **localhost:3000**.
  - After processing by the NestJS app, the response is routed back through Nginx to the client.

### Running the Application Continuously: PM2

- **Issue:** When the terminal session is closed, the application stops because it's tied to that session.
- **Solution:** `PM2` is used to run the application in the background, ensuring it remains operational even if the terminal is closed. PM2 also manages application logs.

## Create an AWS EC2 Instance

EC2 -> Instances -> Launch instances -> Fill out "Name", choose "Ubuntu"

<br>
<br>
<br>

```bash
ssh -i /path/key-pair-name.pem instance-user-name@instance-public-dns-name
```

```
sudo apt install postgresql
```

```bash
sudo -i -u postgres
psql
\password # enter and confirm the password
CREATE DATABASE nestblog;
```

```bash
sudo apt install nginx
systemctl status nginx

cd /etc/nginx/sites-available/
```

```makefile
location / {
  proxy_pass http://localhost:3000;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection 'upgrade';
  proxy_set_header Host $host;
  proxy_cache_bypass $http_upgrade;
}
```

```
sudo systemctl restart nginx
```

## Creating and Running Migrations

```ts
// /typeorm-cli.config.ts
import { DataSource } from "typeorm";

export default new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "12345",
  database: "nest-prod",
  entities: ["**/*.entity.js"],
  migrations: ["migrations/*.js"],
});
```

```bash
npx typeorm migration:generate src/migrations/firstMigration -d dist/typeorm-cli.config
```

## Testing Migration On EC2

```ts
// /typeorm-cli.config.ts
import { DataSource } from "typeorm";
import { FirstMigration1729588780071 } from "./src/migrations/1729588780071-firstMigration.ts";

export default new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "12345",
  database: "nestblog",
  entities: ["**/*.entity.js"],
  migrations: [FirstMigration1729588780071],
});
```

```bash
npx typeorm migration:run -d dist/typeorm-cli.config
```

## Running with PM2

[PM2](https://pm2.keymetrics.io/)

```bash
npm install pm2 -g

pm2 start npm --name nestjs-blog -- start

pm2 ls

pm2 startup

sudo env ...

pm2 save
```
