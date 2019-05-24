#!/bin/sh

curl -s -X POST \
  'https://sonarcloud.io/api/issues/search?componentKeys=tamarasaurus_pim-community-dev&languages=js&types=CODE_SMELL,BUG&ps=500' \
  -H 'content-type: application/x-www-form-urlencoded' | jq --arg commit "$COMMIT" --arg user "$USER" --arg name "sonar" '{ user: $user, commit: $commit, name: $name, inspection: .}' | curl -H "Content-Type: application/json" -X POST -d @- https://shine-poc.herokuapp.com/job

