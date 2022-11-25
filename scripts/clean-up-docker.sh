#!/bin/bash
set -eu

if [ ! "$(docker ps -a | grep cucumber)" ]; then
    echo container cucumber already removed
else
    echo remove container
    docker rm -f cucumber
fi;

if [ ! "$(docker ps -a | grep cms)" ]; then
    echo container cms already removed
else
    echo remove container
    docker rm -f cms
fi;

if [ ! "$(docker ps -a | grep teacher-web)" ]; then
    echo container teacher-web already removed
else
    echo remove container
    docker rm -f teacher-web
fi;

if [ ! "$(docker ps -a | grep learner-web)" ]; then
    echo container learner-web already removed
else
    echo remove container
    docker rm -f learner-web
fi;

if [ ! "$(docker ps -a | grep alive)" ]; then
    echo container alive already removed
else
    echo remove container
    docker rm -f alive
fi;