# Bipad - A disaster information management system

[![pipeline status](https://gitlab.com/bipad/client/badges/feature-ci/pipeline.svg)](https://gitlab.com/bipad/client/commits/feature-ci)

This is web client for the *Bipad*


## Getting started

### Install react-store
```
mkdir -p src/vendor
git clone https://github.com/toggle-corp/react-store --branch=bipad src/vendor/react-store
```

### Start server
```
yarn install # Install dependencies from package.json
yarn start # Start development server
```

### Start server [Using docker]
List of docker images [gitlab registry](https://gitlab.com/bipad/client/container_registry).
For default use this image *registry.gitlab.com/bipad/client/develop:latest*
```
docker run --rm -t <docker-image> sh -c 'yarn install && yarn start' # without local code
docker run --rm -t -p 3050:3050 -v `pwd`/:/code/ <docker-image> sh -c 'yarn install && yarn start' # with local code
```

* Run the application in the browser from http://localhost:3050

docker run --rm -t -p 3050:3050 -v `pwd`/:/code/ registry.gitlab.com/bipad/client/feature-ci:latest sh -c 'yarn install && yarn start'
