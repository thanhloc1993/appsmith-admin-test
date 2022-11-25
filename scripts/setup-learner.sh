#!/bin/bash
set -e
set -x


echo "checkout $ME_REF"

git clone https://github.com/manabie-com/student-app.git ./packages/student-app || true 
cd ./packages/student-app && git reset --hard && git pull && git checkout "$ME_REF" && git pull --ff-only
