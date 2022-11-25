#!/bin/bash
set -e
set -x

env_file="./.env"
echo "# This file is generated default block from .env-cmdrc.json, please dont modify here" > "$env_file"
echo "" >> "$env_file"

echo "TEACHER_FLAVOR=$TEACHER_FLAVOR" >> "$env_file"
echo "LEARNER_FLAVOR=$LEARNER_FLAVOR" >> "$env_file"
echo "CMS_FLAVOR=$CMS_FLAVOR" >> "$env_file"

if [[ "$CI" != "true" ]]; then 
    echo "FE_REF=$FE_REF" >> "$env_file"
    echo "ME_REF=$ME_REF" >> "$env_file"
fi
