#!/bin/bash

set -e
set -x

## This script to check system locale and set it to en_US.UTF-8 if it is not set to en_US.UTF-8
locale

if [[ -z "$BO_HOST" ]]; then
    build_fe=true
fi

if [[ -z "$TEACHER_HOST" || -z "$LEARNER_HOST" ]]; then
    build_me=true
fi

if [[ "$build_fe" == "true" ]]; then
    make setup-cms
fi

if [[ "$build_me" == "true" ]]; then
    make setup-teacher-learner
fi

if [[ "$build_fe" == "true" || "$build_me" == "true" ]]; then
    make setup-docker-images
fi