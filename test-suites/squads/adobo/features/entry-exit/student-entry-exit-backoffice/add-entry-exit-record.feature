@cms
@entry-exit @adobo
@student-entry-exit-backoffice

Feature: School admin adds a new entry & exit record in back office
    Background:
        Given "school admin" logins CMS

    # @blocker
    Scenario Outline: School admin adds new entry & exit record for student
        Given "school admin" has created "student" with "<status>" status and parent info
        When "school admin" adds new entry & exit record for "student"
        Then "school admin" sees new entry & exit record has been saved
        Examples:
            | status    |
            | Enrolled  |
            | Potential |

    Scenario Outline: School admin adds new entry record for student
        Given "school admin" has created "student" with "<status>" status and parent info
        When "school admin" adds new entry record for "student"
        Then "school admin" sees new entry record has been saved
        Examples:
            | status    |
            | Enrolled  |
            | Potential |
