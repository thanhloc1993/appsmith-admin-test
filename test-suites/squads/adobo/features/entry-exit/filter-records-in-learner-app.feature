@cms @learner @parent
@entry-exit @adobo
@staging

Feature: Filter entry and exit records in learner app
    Background:
        Given "school admin" logins CMS
        And "school admin" has created "student" with "Enrolled" status and parent info
        And "student" has at least 1 entry & exit record at this month, last month, this year and the last 2 years
        And "student" logins Learner App
        And "parent P1" of "student" logins Learner App

    Scenario: Filter all records
        When "student" and "parent" view entry & exit information
        Then "student" and "parent" sees all records from "default" display

    Scenario Outline: Filter "<filter>" records
        When "student" and "parent" view entry & exit information
        And "student" and "parent" select filter "<filter>"
        Then "student" and "parent" sees all records from "<filter>" display
        Examples:
            | filter     |
            | this month |
            | last month |
            | this year  |
