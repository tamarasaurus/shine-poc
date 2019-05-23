#!/bin/sh

cd pim-community-dev
php ./vendor/bin/phpmetrics --report-json=phpmetrics.json pim-community-dev/src/Akeneo/Pim
sleep 15
cat phpmetrics.json | jq --arg commit "$COMMIT" --arg name "phpmetrics" '{ commit: $commit, name: $name, inspection: .}' | curl -H "Content-Type: application/json" -X POST -d @- https://shine-poc.herokuapp.com/job
cd ../
