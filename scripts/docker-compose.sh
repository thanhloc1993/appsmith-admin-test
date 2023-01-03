#!/bin/bash

set -e
set -x

web_profile="--profile all --profile cms --profile teacher-web --profile learner-web"
ios_profile="--profile all --profile cms --profile teacher-web"
android_profile="--profile all --profile cms --profile teacher-web"

PROFILE=$web_profile
PLATFORM="WEB"
HOST_PROJECT_PATH=$(cd $(dirname cucumber.js) && echo ${PWD})

fe_profile="--profile cms"
me_profile="--profile teacher-web --profile learner-web"

if [[ $BO_HOST ]]; then
    fe_profile=""
fi

if [[ $TEACHER_HOST && $LEARNER_HOST ]]; then
    me_profile=""
fi

if [[ $1 != "" ]]; then
    if [[ $1 == "web_profile" ]]; then
        PROFILE="--profile all $fe_profile $me_profile"
        PLATFORM="WEB"
    elif [[ $1 == "android_profile" ]]; then
        # supporting for attach script
        sh -c 'cd packages/student-app/manabie_learner && flutter pub get'
        PROFILE=$android_profile
        PLATFORM="ANDROID"
    elif [[ $1 == "ios_profile" ]]; then
        PROFILE=$ios_profile
        PLATFORM="IOS"
    fi
fi

docker compose $PROFILE down
bash ./scripts/clean-up-docker.sh

if [[ $2 == "up" ]]; then
    COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 PLATFORM=$PLATFORM docker compose $PROFILE up --exit-code-from cucumber --build
fi
