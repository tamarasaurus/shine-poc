#!/bin/sh

php vendor/bin/phpstan analyse -c phpstan.neon pim-community-dev/src/Akeneo/Pim -l 1 --error-format=json --no-progress --no-interaction > phpstan.json
cat phpstan.json | curl -H "Content-Type: application/json" -X POST -d @- https://shine-poc.herokuapp.com/job
