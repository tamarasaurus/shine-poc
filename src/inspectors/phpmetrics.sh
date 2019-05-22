#!/bin/sh

cd pim-community-dev
php -d memory_limit=3G /usr/local/bin/composer --quiet require phpmetrics/phpmetrics
php ./vendor/bin/phpmetrics --quiet --report-json=phpmetrics.json src/Akeneo/Pim
sleep 15
cat phpmetrics.json
