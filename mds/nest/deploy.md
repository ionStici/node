# AWS EC2 Deployment

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

**Create AWS EC2 Instance** -> EC2 -> Instances -> Launch instances -> Fill out "Name", choose "Ubuntu" -> Choose your Key Pair or create a new one (if create then select RSA type and PEM format) -> Configure Network settings (Allow SSH, HTTPS, HTTP) -> Click Launch Instance -> Go to the created EC2 instance -> **Public IPv4 DNS** can be used to connect to the instance via SSH.

## Connect to an EC2 Instance and Installing Node.js and Dependencies

### Connect to the EC2 Instance via SSH

```bash
ssh -i /path/key-pair.pem ubuntu@instance-public-ipv4-dns
```

- Replace `/path/key-pair.pem` with the actual path to your key file.
- Replace `instance-public-ipv4-dns` with the public DNS address of your EC2 instance.
- If prompted, type `yes` to add the server's fingerprint.

### Check if git is installed

```bash
git --version
```

`git` usually comes pre-installed with Ubuntu.

### Update the Package Repository

```
sudo apt update
```

### Install NVM (Node Version Manager)

Go to [NVM repo](https://github.com/nvm-sh/nvm), copy and paste the curl command to install NVM:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

Restart the terminal for the changes to take effect.

```bash
nvm --version
```

Check NVM installation.

### Install Node.js and NPM

```bash
# Install the latest LTS version of Node.js
nvm install --lts

# Use the installed LTS version
nvm use --lts
```

```bash
# Check Node.js and NPM versions
node --version
npm --version
```

## Installing and Setting Up PostgreSQL

```bash
# Install PostgreSQL
sudo apt install postgresql
psql --version

# Switch to the PostgreSQL default user account
sudo -i -u postgres

# Access the PostgreSQL interactive shell
psql

# Set a password for the 'postgres' user
\password
# Then: Enter and confirm the password

# Create a New Database
CREATE DATABASE nest_blog;
```

## Installing and Configuring Nginx on an EC2 Instance

```bash
# Install Nginx
sudo apt install nginx

# Check Firewall Status
sudo ufw status
# Disable if active
sudo ufw disable

# Check Nginx Status
sudo systemctl status nginx

# Navigate to Nginx Configuration Files
cd /etc/nginx/sites-available

# Open the Default Configuration
sudo nano default
```

_Remove the root property and index files:_

```
root /var/www/html;
index index.html index.htm index.nginx-debian.html;
```

_Add the following configuration to proxy pass requests to the NestJS application:_

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

This setup will route all incoming requests on port 80 (Nginx) to localhost:3000 where your NestJS application will run.

```bash
# Restart Nginx to apply the new configurations
sudo systemctl restart nginx
# Check the status again
sudo systemctl status nginx
```

## Cloning and Installing a NestJS Application

```bash
# Install NestJS CLI
npm install -g @nestjs/cli

# Clone the project
git close https://github.com/repo .

# Create '.env' file and Add the required environment variables
nano .env

# Start the project in production mode
npm start
```

## Running a NestJS App with PM2 on EC2

[**PM2**](https://pm2.keymetrics.io/) - Process manager for Node.js applications, that ensures the application continues running even if you close the terminal or the server restarts.

```bash
# Globally install PM2
npm i pm2 -g
```

Start the app using PM2 to keep it running even after you close the terminal:

```bash
pm2 start npm --name project-name -- start
```

This command tells PM2 to run the `npm start` script for the NestJS app, giving it the name `project-name` for easy identification.

```bash
# List all running processes manages by PM2
pm2 ls
```

To ensure that your NestJS application restarts automatically if the EC2 instance reboots, run the following command:

```bash
pm2 startup
```

PM2 will display a command that you need to run to enable startup on system boot. Copy and paste that command into your terminal and run it.

After configuring PM2 to start on boot, save the currently running applications to ensure they restart automatically:

```bash
pm2 save
```

Go back to your browser and refresh the public DNS to confirm that the application is still running and accessible.

Additional PM2 command to manage the application:

```bash
# Restart an application
pm2 restart project-name

# Stop an application
pm2 stop project-name

# Delete an application from PM2 management
pm2 delete project-name
```
