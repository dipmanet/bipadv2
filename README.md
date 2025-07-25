# Bipad - A disaster information management system

[![pipeline status](https://gitlab.com/bipad/client/badges/develop/pipeline.svg)](https://gitlab.com/bipad/client/commits/develop) [![coverage status](https://gitlab.com/bipad/client/badges/develop/coverage.svg)](https://gitlab.com/bipad/client/commits/develop)

This is the web client for _Bipad_

## Getting started

### Install dependencies

```bash
yarn vendor:clone
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
DEV_SERVER_URL=http://localhost:3050
ACTUAL_DOMAIN=bipad.staging.nepware.com
PROXY_DOMAIN=bipad-localhost.com
```

### Updating Hostnames

We will be using `PROXY_DOMAIN` for client and server. In
`/etc/hosts` file, add the following:

```
# national level
127.0.0.1    PROXY_DOMAIN

# province level
127.0.0.1    p1.PROXY_DOMAIN
127.0.0.1    p2.PROXY_DOMAIN
127.0.0.1    p3.PROXY_DOMAIN
127.0.0.1    gandaki.PROXY_DOMAIN
127.0.0.1    karnali.PROXY_DOMAIN
127.0.0.1    sudurpaschim.PROXY_DOMAIN

# district level
127.0.0.1    taplejung.PROXY_DOMAIN
127.0.0.1    panchthar.PROXY_DOMAIN

# municipality level
127.0.0.1    aathraitribenimun.PROXY_DOMAIN
127.0.0.1    maiwakholamun.PROXY_DOMAIN
```

### Install Nginx

```bash
sudo pacman -S nginx
```

### Setting up Nginx

Our client will be running at `DEV_SERVER_URL` and our server on
`ACTUAL_DOMAIN` so we need to set up proxy in our nginx. Create
`/etc/nginx/custom.conf` file with following content:

```
server {
    listen 81;
    server_name PROXY_DOMAIN;
    location /media {
        proxy_pass http://ACTUAL_DOMAIN;
    }
    location /static {
        proxy_pass http://ACTUAL_DOMAIN;
    }
    location /admin {
        proxy_pass http://ACTUAL_DOMAIN;
    }
    location /en/admin {
        proxy_pass http://ACTUAL_DOMAIN;
    }
    location /api {
        proxy_pass http://ACTUAL_DOMAIN;
    }
    location / {
        proxy_pass DEV_SERVER_URL;
    }
    proxy_cookie_domain ~^(.+)$ .PROXY_DOMAIN;
}

server {
    listen 80;
    server_name ~^([a-zA-Z0-9]+)\.PROXY_DOMAIN;
    location /api {
        proxy_pass http://ACTUAL_DOMAIN;
    }
    location / {
        proxy_pass DEV_SERVER_URL;
    }
    proxy_cookie_domain ~^(.+)$ .PROXY_DOMAIN;
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
VITE_APP_SESSION_COOKIE_NAME=ACTUAL_DOMAIN

VITE_APP_DOMAIN=PROXY_DOMAIN

VITE_APP_API_SERVER_URL=http://PROXY_DOMAIN/api/v1

VITE_APP_ADMIN_LOGIN_URL=http://PROXY_DOMAIN/admin
```
