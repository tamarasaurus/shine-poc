#!/bin/sh

export DOCKER_PORT_HTTP=8080
export DOCKER_PORT_HTTP_BEHAT=8081

git clone git@github.com:akeneo/pim-community-dev.git tmp/pim-community-dev
cd tmp/pim-community-dev
# checkout the same commit as the github hook
docker-compose up -d fpm
docker-compose exec -T fpm php -d memory_limit=3G /usr/local/bin/composer install
