#!/bin/sh

php ./vendor/bin/phpmetrics --report-json=phpmetrics.json pim-community-dev/src/Akeneo/Pim
sleep 15
ls
cat phpmetrics.json
