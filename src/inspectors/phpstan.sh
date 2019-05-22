#!/bin/sh

cd tmp/pim-community-dev
vendor/bin/phpstan analyse -c phpstan.neon src/Akeneo/Pim -l 1 --error-format=json --no-progress --no-interaction > phpstan.json
cat phpstan.json
