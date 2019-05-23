#!/bin/sh

cd pim-community-dev && php vendor/bin/phpstan analyse -c phpstan.neon src/Akeneo/Pim -l 1 --error-format=json --no-progress --no-interaction > phpstan.json
cat phpstan.json | jq --arg commit "$COMMIT" --arg name "phpstan" '{ commit: $commit, name: $name, inspection: .}' | curl -H "Content-Type: application/json" -X POST -d @- https://shine-poc.herokuapp.com/job
