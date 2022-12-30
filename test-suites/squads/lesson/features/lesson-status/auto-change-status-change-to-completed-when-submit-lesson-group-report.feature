@cms
@lesson
@lesson-status

Feature: The status auto-change to Completed when submitting group lesson report
    Background:
        Given "school admin" logins CMS

    Scenario Outline: The status auto-change to Completed when submit the group lesson report of the <status> one time lesson
        Given "school admin" has created a "<status>" "group" "One Time" lesson in "future" with filled Attendance status
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to detailed lesson info page
        And "school admin" has opened creating "group" lesson report page
        And "school admin" has fulfilled group lesson report info
        When "school admin" click button "Submit All" on lesson group report page
        Then "school admin" is redirected to detailed group lesson report page
        And "school admin" sees the lesson's status is "Completed"
        Examples:
            | status    |
            | Draft     |
            | Published |

    Scenario Outline: The status auto-change to Completed when submit group lesson report of the <status> weekly recurring lesson
        Given "school admin" has created a "<status>" "group" "Weekly Recurring" lesson in "future" with filled Attendance status
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to detailed lesson info page of the 1st lesson in the chain
        And "school admin" has opened creating "group" lesson report page
        And "school admin" has fulfilled group lesson report info
        When "school admin" click button "Submit All" on lesson group report page
        Then "school admin" is redirected to detailed group lesson report page
        And "school admin" sees the lesson's status is "Completed"
        And "school admin" sees the status of the all lessons in the chain still is "<status>" after 1st lesson "future"
        Examples:
            | status    |
            | Draft     |
            | Published |
