@cms
@entry-exit @adobo
@student-entry-exit-backoffice

Feature: School admin cannot edit entry & exit record
    Background:
        Given "school admin" logins CMS

    Scenario Outline: School admin cannot edit record if exit time is earlier than entry time
        Given "school admin" has created "student" with "<status>" status and parent info
        When "school admin" adds new entry & exit record for "student"
        Then "school admin" sees new entry & exit record has been saved
        And "school admin" edits record where exit date is earlier than entry date for "student"
        And "school admin" cannot update the entry & exit record
        Examples:
            | status    |
            | Enrolled  |
            | Potential |

    Scenario Outline: School admin cannot edit record of <status> student
        Given "school admin" has created "student" with "enrolled" status and parent info
        And at least 1 entry & exit record has been created for "enrolled" "student"
        And "school admin" updates student status to "<status>"
        When "school admin" tries to edit a record of "student"
        Then "school admin" sees that they cannot edit a record
        Examples:
            | status    |
            | Withdrawn |
            | LOA       |
            | Graduated |
