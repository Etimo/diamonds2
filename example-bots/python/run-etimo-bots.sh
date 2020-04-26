#!/bin/sh

URL=http://backend:5000/api
run() {
    pipenv run python main.py --logic FirstDiamond --email=$1 --name=$2 --host=$URL &
}

echo Waiting for server to start...
while [ 1 ]; do
    nc -z $URL 5000
    if [ $? -eq 0 ]; then
        break
    fi
    sleep 1
done
echo Starting

tokens=$(ls -la /bot-data/.token* | wc -l)
if [ $tokens != "0" ]; then
    # Existing tokens, use them
    echo Found $tokens existing tokens, use them
    for f in $(ls /bot-data/.token*); do
        token=$(cat $f)
        pipenv run python main.py --logic FirstDiamond --token=$token --host=$URL &
        sleep 10
    done
else
    # Create new bots
    for bot in etimo1 etimo2; do
        pipenv run python main.py --logic FirstDiamond --email=$bot@etimo.se --name=$bot --host=$URL &
        sleep 10
    done
    cp .token* /bot-data
fi

wait
sleep 5