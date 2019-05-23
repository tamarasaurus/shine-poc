#!/bin/sh

# trigger incremental inspection to get the index_diff

# UUID=$(curl -s -H "Content-Type: application/json" \
# --request POST "https://scrutinizer-ci.com/api/repositories/g/akeneo/pim-community-dev/inspections?access_token=${SCRUTINIZER_TOKEN}" \
#  -d "{\"branch\": \"master\", \"source_reference\": \"${COMMIT}\"}" | jq -r '.uuid'  )
# curl -s GET https://scrutinizer-ci.com/api/repositories/g/akeneo/pim-community-dev/inspections?sort_field=finished_at

curl -s GET "https://scrutinizer-ci.com/api/repositories/g/akeneo/pim-community-dev/inspections/8aa1c7d3-56fe-4c88-8df5-938bd8504b9f" | jq '._embedded.index_diff * ._embedded.repository.applications.master.index._embedded.project.metric_values' | jq --arg commit "$COMMIT" --arg name "scrutinizer" '{ commit: $commit, name: $name, inspection: .}' | curl -H "Content-Type: application/json" -X POST -d @- https://shine-poc.herokuapp.com/job

# set up webhook for finishing
