#!/bin/bash
set -e
set -x

commit="$(git rev-parse --short HEAD)"



output=./cms-commit-hash.txt  

# build folder
build=./build

start() {
    version="$(cat $output || true)"
    if [[ "$CI" != "true" ]]; then
        cd packages/cms
    fi
    if [[ "$version" != "$commit" || ! -d "$build" ]]; then
        yarn install

        echo "Build new version $commit"

        echo "$commit" > $output 

        yarn build 
    else  
        echo "Keep old version $version"
    fi

    yarn serve
}

mkdir -p $PWD/report/build-logs
start | tee $PWD/report/build-logs/cms.log

