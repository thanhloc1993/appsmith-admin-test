@cms
@lesson
@lesson-status
@ignore

Feature: The status auto-change to Completed when submit group lesson report
    Background:
        Given "school admin" logins CMS
        And "school admin" has applied "all child locations of parent" location

    Scenario Outline: The status auto-change to Completed when submitting the lesson report of the <status> one time group lesson
        Given "school admin" has created a "<status>" one time "group" lesson with filled Attendance status
        And "school admin" has gone to detailed lesson info page
        And "school admin" has opened creating "group" lesson report page
        And "school admin" has fulfilled group lesson report info
        When "school admin" submits "group" lesson report
        Then "school admin" is redirected to detailed lesson report page
        And "school admin" sees the lesson's status is "Completed"
        Examples:
            | status    |
            | Draft     |
            | Published |

    Scenario Outline: The status auto-change to Completed when submitting lesson report of the <status> weekly recurring group lesson
        Given "school admin" has created "<status>" weekly recurring "group" lesson in the "future"
        And "school admin" has gone to detailed lesson info page of the 1st lesson in the chain
        And "school admin" has opened creating "group" lesson report page
        And "school admin" has fulfilled group lesson report info
        When "school admin" submits "group" lesson report
        Then "school admin" is redirected to detailed lesson report page
        And "school admin" sees the lesson's status is "Completed"
        And "school admin" sees the status of the all lessons in the chain still is "<status>"
        Examples:
            | status    |
            | Draft     |
            | Published |
