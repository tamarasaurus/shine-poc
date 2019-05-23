#!/bin/sh

php vendor/bin/phpstan analyse -c pim-community-dev/phpstan.neon pim-community-dev/src/Akeneo/Pim -l 1 --error-format=json --no-progress --no-interaction > phpstan.json
cat phpstan.json | jq --arg commit "$COMMIT" --arg name "phpstan" '{ commit: $commit, name: $name, inspection: .}' | curl -H "Content-Type: application/json" -X POST -d @- https://shine-poc.herokuapp.com/job
