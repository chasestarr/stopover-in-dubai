#!/usr/bin/env bash

docker-compose build
docker-compose run api glide install
docker-compose run api go build -o main
