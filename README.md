# Bipad - A disaster information management system

[![pipeline status](https://gitlab.com/bipad/client/badges/develop/pipeline.svg)](https://gitlab.com/bipad/client/commits/develop) [![coverage status](https://gitlab.com/bipad/client/badges/develop/coverage.svg)](https://gitlab.com/bipad/client/commits/develop)


This is the web client for *Bipad*


## Getting started

### Install react-store

```bash
mkdir -p src/vendor
git clone https://github.com/toggle-corp/react-store --branch=bipad src/vendor/react-store
```

### Start server

```bash
# Install dependencies from package.json
yarn install

# Start development server
yarn start
```

## Setting up proxy server locally

Note that, this is necessary in order to "simulate" our client and api server
to be in same domain.

### Variables used in this document for ease

```ini
SERVER_ENDPOINT=http://bipad.staging.nepware.com
CLIENT_ENDPOINT=http://localhost:3050
PROXY_DOMAIN=bipad.localhost.com
```

### Updating Hostnames

We will be using `PROXY_DOMAIN` for client and server. In
`/etc/hosts` file, add the following:

```
127.0.0.1    PROXY_DOMAIN
127.0.0.1    pokhara.PROXY_DOMAIN
127.0.0.1    kathmandu.PROXY_DOMAIN
```

### Install Nginx

```bash
sudo pacman -S nginx
```

### Setting up Nginx

Our client will be running at `CLIENT_ENDPOINT` and our server on
`SERVER_ENDPOINT` so we need to set up proxy in our nginx. Create
`/etc/nginx/custom.conf` file with following content:


```
server {
    listen 81;
    server_name PROXY_DOMAIN;
    location /api {
        proxy_pass http://SERVER_ENDPOINT;
    }
    location /media {
        proxy_pass http://SERVER_ENDPOINT;
    }
    location /static {
        proxy_pass http://SERVER_ENDPOINT;
    }
    location /admin {
        proxy_pass http://SERVER_ENDPOINT;
    }
    location /en/admin {
        proxy_pass http://SERVER_ENDPOINT;
    }
    location / {
        proxy_pass CLIENT_ENDPOINT;
    }
    proxy_cookie_path ~^(.+)$ "$1; Domain=.PROXY_DOMAIN";
}

server {
    listen 80;
    server_name ~^([a-zA-Z0-9]+)\.PROXY_DOMAIN;
    location / {
        proxy_pass http://localhost:3050;
    }
    proxy_cookie_path ~^(.+)$ "$1; Domain=.PROXY_DOMAIN";
}
```

And, update `/etc/nginx/nginx.conf` file to have the following:

```
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include custom.conf;
}
```

Then, restart nginx:

```bash
sudo systemctl restart nginx
```

Also, add the following environment variables to `.env` file:

```
REACT_APP_SESSION_COOKIE_NAME=SERVER_ENDPOINT

REACT_APP_DOMAIN=PROXY_DOMAIN

REACT_APP_API_SERVER_URL=http://PROXY_DOMAIN/api/v1

REACT_APP_ADMIN_LOGIN_URL=http://PROXY_DOMAIN/admin
```
