@cms
@entry-exit @adobo
@student-entry-exit-backoffice

Feature: School admin cannot add new entry & exit record in back office
    Background:
        Given "school admin" logins CMS

    Scenario Outline: School admin cannot create new record if exit time is earlier than entry time
        Given "school admin" has created "student" with "<status>" status and parent info
        When "school admin" adds new entry & exit record with exit time earlier than entry time for "student"
        Then "school admin" sees an error message displayed
        Examples:
            | status    |
            | Enrolled  |
            | Potential |

    Scenario Outline: School admin cannot add new record for <cannotStatus> student
        Given "school admin" has created "student" with "<cannotStatus>" status and parent info
        When "school admin" views entry & exit information of "<cannotStatus>" "student"
        Then "school admin" sees that they cannot add a record
        Examples:
            | cannotStatus |
            | Withdrawn    |
            | LOA          |
            | Graduated    |
