#!/bin/bash
set -eu

set -o noglob

squads=("adobo" "architecture" "communication" "platform" "user-management" "payment" "lesson" "syllabus" "virtual-classroom")

for squad in "${squads[@]}"; do
    echo "Generating schema for ${squad}"
    npx ts-node configurations/run-cucumber/index.ts gen-tag-schema --output-path ./test-suites/squads/${squad}/schema.json ./test-suites/squads/${squad}/features/**/*.feature  
done


npx ts-node configurations/run-cucumber/index.ts gen-tag-schema --output-path ./test-suites/squads/schema.json ./test-suites/squads/**/features/**/*.feature  
