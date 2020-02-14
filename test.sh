#! /bin/bash

printf "Installing composer\n"
curl -sS https://getcomposer.org/installer | php

printf "Installing dependencies\n"
php composer.phar install --ignore-platform-reqs

printf "Starting server\n"
php -S 0.0.0.0:3003 -t web/ &
sleep 3

printf "Checking is up\n"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" localhost:3003)

printf "Terminating server\n"
killall php

if [ "$STATUS" -ne "200" ]
then
  printf "Test failed\n"
  exit 1
else
  printf "All good!\n"
  exit 0
fi


