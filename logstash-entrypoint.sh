#!/bin/bash -e

until ping -c1 ${ES_HOST:-elasticsearch} &> /dev/null; do
    echo "waiting for elasticsearch"
    sleep 3
done

exec /docker-entrypoint.sh "$@"

