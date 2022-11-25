#!/bin/bash

# default valud for run id if not set
RUN_ID="${RUN_ID:-$(openssl rand -hex 10)}"

export COMMIT_HASH=$(git rev-parse --short HEAD)
export COMMIT_HASH_CMS=$(cd packages/cms/ && git rev-parse --short HEAD)
export COMMIT_HASH_STUDENT_APP=$(cd packages/student-app/ && git rev-parse --short HEAD)
export BRANCH=$(git branch --show-current)
export BRANCH_CMS=$(cd packages/cms/ && git branch --show-current)
export BRANCH_STUDENT_APP=$(cd packages/student-app/ && git branch --show-current)
export USERNAME=$(git config user.name)
export EMAIL=$(git config user.email)

PREFIX_PATH=${PREFIX_PATH} npx ts-node ./configurations/tools/reporter.ts
cp -a ${PREFIX_PATH}report/logs/ ${PREFIX_PATH}report/histories/${RUN_ID}/features/logs/ || true
