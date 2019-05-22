#!/bin/sh

php ./vendor/bin/phpmetrics --report-json=phpmetrics.json pim-community-dev/src/Akeneo/Pim
sleep 15
cat phpmetrics.json | curl -H "Content-Type: application/json" -X POST -d @- https://shine-poc.herokuapp.com/job
