#!/bin/sh

TMP_DIR=tmp/pim-community-dev

if [ -d "$TMP_DIR" ]; then
    cd $TMP_DIR
    docker-compose down
    rm -rf $TMP_DIR
fi

git clone git@github.com:akeneo/pim-community-dev.git $TMP_DIR
cd $TMP_DIR
cp .env.dist .env

docker-compose up -d fpm
# git checkout $COMMIT

docker-compose exec -T fpm /usr/bin/php -d memory_limit=3G /usr/local/bin/composer install