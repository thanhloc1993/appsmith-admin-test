@cms
@entry-exit @adobo
@student-entry-exit-backoffice

Feature: School admin edits entry & exit record
    Background:
        Given "school admin" logins CMS

    # @blocker
    Scenario Outline: School admin can edit entry & exit date/time
        Given "school admin" has created "student" with "<status>" status and parent info
        When "school admin" adds new entry & exit record for "student"
        Then "school admin" sees new entry & exit record has been saved
        And "school admin" edits the entry & exit record for "student"
        And "school admin" sees entry & exit record with the updated data
        Examples:
            | status    |
            | Enrolled  |
            | Potential |
