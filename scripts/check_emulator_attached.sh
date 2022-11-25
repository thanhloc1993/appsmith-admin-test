#!/bin/bash

set -e
flutter config --no-enable-web
devices=$(flutter devices)
retry=12

while [[ $devices =~ "No devices detected" ]] || [[ $devices =~ "offline" ]]
do
    echo "retry attach emulator"
    if [[ $retry -eq 0 ]] 
    then
        echo $(No devices)
        exit 1
    fi

    sleep 5

    devices=$(flutter devices)
    if [[ $devices != *"No devices detected"* ]] && [[ $devices != *"offline"* ]]
    then
        break
    fi

    ((--retry))
done

echo $(flutter devices)
flutter config --enable-web