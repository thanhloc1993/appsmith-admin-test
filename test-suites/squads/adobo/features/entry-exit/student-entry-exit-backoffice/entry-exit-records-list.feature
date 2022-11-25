@cms
@entry-exit @adobo
@student-entry-exit-backoffice

Feature: School admin filters entry and exit time record in back office
    Background:
        Given "school admin" logins CMS
        And "school admin" has created "student" with "Enrolled" status and parent info
        And "student" has at least 1 entry & exit record at this month, last month, this year and the last 2 years

    Scenario: Filter all records
        When "school admin" views entry & exit information of "Enrolled" "student"
        Then "school admin" sees all records displayed as default

    Scenario Outline: Filter "<filter>" records
        When "school admin" views entry & exit information of "student"
        And "school admin" selects filter = "<filter>"
        Then "school admin" sees all records from "<filter>" displayed
        Examples:
            | filter     |
            | this month |
            | last month |
            | this year  |
