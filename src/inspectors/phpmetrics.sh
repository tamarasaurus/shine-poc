#!/bin/sh

cd pim-community-dev && php ./vendor/bin/phpmetrics --report-json=phpmetrics.json src/Akeneo/Pim
sleep 15
cat phpmetrics.json | jq --arg commit "$COMMIT" --arg user "$USER" --arg name "phpmetrics" '{ commit: $commit, name: $name, user: $user, inspection: .}' | curl -H "Content-Type: application/json" -X POST -d @- https://shine-poc.herokuapp.com/job
cd ../
