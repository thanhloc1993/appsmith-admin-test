#!/bin/bash
set -e
set -x

FLAVOR=$LEARNER_FLAVOR

if [[ ! -d "$LEARNER_PROFILE" ]] 
then
    LEARNER_PROFILE='learner_1'
fi


start() {
    cd packages/student-app/manabie_learner && \
    make run-web-cross-testing flavor=$FLAVOR file=$LEARNER_PROFILE 
}

mkdir -p $PWD/report/build-logs
start | tee $PWD/report/build-logs/learner.log
