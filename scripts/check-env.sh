#!/bin/bash

if [[ -z "$TEACHER_FLAVOR" ]]; then
    echo "missing TEACHER_FLAVOR env"
    exit 1
fi

if [[ -z "$LEARNER_FLAVOR" ]]; then
    echo "missing LEARNER_FLAVOR env"
    exit 1
fi

if [[ -z "$CMS_FLAVOR" ]]; then
    echo "missing CMS_FLAVOR env"
    exit 1
fi

if [[ -z "$BO_HOST" ]]; then
    if [[ -z "$FE_REF" ]]; then
        echo "missing FE_REF env"
        exit 1
    fi
fi

if [[ -z "$TEACHER_HOST" || -z "$LEARNER_HOST" ]]; then
    if [[ -z "$ME_REF" ]]; then
        echo "missing ME_REF env"
        exit 1
    fi
fi

if [[ -z "$UNLEASH_CLIENT_KEY" ]]; then
    echo "missing UNLEASH_CLIENT_KEY env"
    echo -e '=> Goto https://github.com/manabie-com/eibanam/discussions/1838 to get the client key.'
    exit 1
fi

if [[ -z "$ENV" ]]; then
    echo "missing ENV env"
    echo "in your .env.local, set ENV=uat or ENV=staging"
    exit 1
fi
