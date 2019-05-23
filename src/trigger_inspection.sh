#!/bin/sh

echo 'Trigger inspection'

BODY="{
 \"request\": {
 \"message\": \"API Request\",
 \"branch\":\"travis\",
 \"config\": {
   \"env\": {
     \"matrix\": [\"COMMIT=$COMMIT USER=$USER\"]
   }
  }
}}"

curl -s -X POST \
 -H "Content-Type: application/json" \
 -H "Accept: application/json" \
 -H "Travis-API-Version: 3" \
 -H "Authorization: token ${TRAVIS_TOKEN}" \
 -d "$BODY" \
 https://api.travis-ci.org/repo/tamarasaurus%2Fshine-poc/requests
