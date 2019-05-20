#!/bin/sh

cd tmp/pim-community-dev
docker-compose exec -T fpm php -d memory_limit=3G /usr/local/bin/composer require phpmetrics/phpmetrics
docker-compose exec -T fpm php ./vendor/bin/phpmetrics src/Akeneo/Pim --report-json=phpmetrics.json
docker-compose exec -T fpm cat phpmetrics.json
