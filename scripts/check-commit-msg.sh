#!/bin/bash

# regexp matches automated commit message of a local "git merge" or a "git pull" that requires a merge
regexp_merge="^(Merge (remote-tracking )?branch (.+)(of (.+) )?into (.+))$"

# regexp matches commit message which has exactly one LT-XXX (up to 6 digits)
# Jira has no upper limit on the ticket number but as of now, for us, it's impossible to reach 7 digits.
regexp_message="\bLT-[0-9]{1,6}\b"

check_message() {
    message="$1"

    is_git_merge=$((echo ${message} | grep -o -E "${regexp_merge}" | grep -c "") || return 0)
    if [[ ${is_git_merge} == 1 ]]; then
        return 0
    fi

}
check_pr_title() {
    title="$1"
    match_count=$((echo ${title} | grep -o -E "${regexp_message}" | grep -c "") || return 0)
    if [[ ${match_count} != 1 ]]; then
        >&2 echo "ERROR: expect 1 Jira ticket ID in pull request's title, got ${match_count} (title: \"${title}\")"; return 1
    fi
    return 0
}
