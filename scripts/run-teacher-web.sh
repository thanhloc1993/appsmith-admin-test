#!/bin/bash
set -e
set -x

FLAVOR=$TEACHER_FLAVOR

if [[ ! -d "$TEACHER_PROFILE" ]] 
then
    TEACHER_PROFILE='teacher_1'
fi


start() {
    cd packages/student-app/manabie_teacher && \
    make run-web-cross-testing flavor=$FLAVOR file=$TEACHER_PROFILE 
}

mkdir -p $PWD/report/build-logs
start | tee $PWD/report/build-logs/teacher.log