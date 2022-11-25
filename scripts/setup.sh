#!/bin/bash
set -e
set -x

report_dir=${PREFIX_PATH}report

TOKEN=$(eval echo $GITHUB_TOKEN)

if [[ "$TOKEN" == "" ]]; then 
    echo "Please setup GITHUB_TOKEN"
    exit 1
fi


mkdir -p ./downloads
mkdir -p $report_dir
mkdir -p $report_dir/message/
mkdir -p $report_dir/trace-viewer/
mkdir -p $report_dir/json/
mkdir -p $report_dir/histories/
mkdir -p $report_dir/logs/
mkdir -p $report_dir/build-logs/
mkdir -p $report_dir/message/

if [[ "CI" == "true" ]]; then
    echo "Running in CI mode"
    
    yarn install --frozen-lockfile && yarn link && yarn link "eibanam"
else
    echo "Running in local mode"
    
    yarn install && yarn link && yarn link "eibanam"
fi