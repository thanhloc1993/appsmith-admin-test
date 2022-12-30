#!/bin/bash
set -e

HAS_CHANGES=false
DIFF=$(git diff --name-only origin/develop.. -- ${1})

if [[ -z $DIFF ]]; then
    echo "No changes found under the '${1}' folder."
else
    echo "Detect changes under the '${1}' folder."
    echo "$DIFF"
    HAS_CHANGES=true
fi

echo "has_changes=$HAS_CHANGES" >>$GITHUB_OUTPUT
