#!/bin/sh

composer --quiet require phpmetrics/phpmetrics
php ./vendor/bin/phpmetrics --quiet --report-json=phpmetrics.json pim-community-dev/src/Akeneo/Pim
sleep 15
cat phpmetrics.json
