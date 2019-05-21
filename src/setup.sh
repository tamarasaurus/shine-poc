#!/bin/sh

# checkout the same commit as the github hook
git clone git@github.com:akeneo/pim-community-dev.git tmp/pim-community-dev
cd tmp/pim-community-dev
cp .env.dist .env

docker-compose up -d fpm
docker-compose exec -T fpm php -d memory_limit=3G /usr/local/bin/composer install
