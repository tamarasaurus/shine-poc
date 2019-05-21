#!/bin/sh

cd tmp/pim-community-dev
docker-compose exec -T fpm php -d memory_limit=3G /usr/local/bin/composer --quiet require phpmetrics/phpmetrics
docker-compose exec -T fpm php ./vendor/bin/phpmetrics --quiet src/Akeneo/Pim --report-json=phpmetrics.json
sleep 2
docker-compose exec -T fpm cat phpmetrics.json
