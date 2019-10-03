# Bipad - A disaster information management system

[![pipeline status](https://gitlab.com/bipad/client/badges/develop/pipeline.svg)](https://gitlab.com/bipad/client/commits/develop) [![coverage status](https://gitlab.com/bipad/client/badges/develop/coverage.svg)](https://gitlab.com/bipad/client/commits/develop)



This is web client for the *Bipad*


## Getting started

### Install react-store
```bash
mkdir -p src/vendor
git clone https://github.com/toggle-corp/react-store --branch=bipad src/vendor/react-store
```

### Start server
```bash
yarn install # Install dependencies from package.json
yarn start # Start development server
```


## Setting up proxy server locally
Note that, this is necessary in order to "simulate" our client and api server to be in same domain.
This is necessary to display the UI buttons depending upon if user is logged in server or not.

### Install Nginx
```bash
sudo pacman -S nginx
```

### Updating Hostnames
We will be using `bipad-admin.localhost.com` for client and server.
In `/etc/hosts` file, add the following:

```
127.0.0.1    bipad-admin.localhost.com
```

### Setting up Nginx
But, our client will be running at `http://localhost:3050` and our server on `bipad.staging.nepware.com` so, we need to set up proxying in our nginx.
Create `/etc/nginx/custom.conf` file with following content:
```
# custom.conf, included by nginx.conf

server {
    listen 80;
    server_name bipad-admin.localhost.com;
    location /api {
        proxy_pass http://bipad.staging.nepware.com;
    }
    location /media {
        proxy_pass http://bipad.staging.nepware.com;
    }
    location /static {
        proxy_pass http://bipad.staging.nepware.com;
    }
    location /admin {
        proxy_pass http://bipad.staging.nepware.com;
    }
    location /en/admin {
        proxy_pass http://bipad.staging.nepware.com;
    }
    location / {
        proxy_pass http://localhost:3050;
    }
    # proxy_cookie_domain ~^(.+)(domain=localhost.com)(.+)$ "$1 domain=.localhost.com $3";
    proxy_cookie_path ~^(.+)$ "$1; Domain=.localhost.com";
}
```

And, update our `/etc/nginx/nginx.conf` file to have the following:
```
# /etc/nginx/nginx.conf

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
Then restart nginx:
```bash
sudo systemctl restart nginx
```

Also, add the following to `.env` file:
```
REACT_APP_SESSION_COOKIE_NAME=bipad.staging.nepware.com

REACT_APP_API_SERVER_URL=http://bipad-admin.localhost.com/api/v1

REACT_APP_ADMIN_LOGIN_URL=http://bipad-admin.localhost.com/admin
```
