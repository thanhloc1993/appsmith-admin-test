@cms
@lesson
@lesson-status

Feature: The auto-change status to Completed when submitting individual lesson report
    Background:
        Given "school admin" logins CMS

    Scenario Outline: The status auto-change to Completed when submit individual lesson report of the <status> one time lesson
        Given "school admin" has created a "<status>" "One Time" "individual" lesson in the "future"
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to detailed lesson info page
        And "school admin" has opened creating "individual" lesson report page
        And "school admin" has fulfilled individual lesson report info
        When "school admin" click button "Submit All" on individual lesson report page
        Then "school admin" is redirected to detailed lesson report page
        And "school admin" sees the lesson's status is "Completed"
        Examples:
            | status    |
            | Draft     |
            | Published |

    Scenario Outline: The status auto-change to Completed when submit individual lesson report of the <status> weekly recurring lesson
        Given "school admin" has created a "<status>" "Weekly Recurring" "individual" lesson in the "future"
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to detailed lesson info page of the 2nd lesson in the chain
        And "school admin" has opened creating "individual" lesson report page
        And "school admin" has fulfilled individual lesson report info
        When "school admin" click button "Submit All" on individual lesson report page
        Then "school admin" is redirected to detailed lesson report page
        And "school admin" sees the lesson's status is "Completed"
        And "school admin" sees the status of the all lessons in the chain still is "<status>" after 2nd lesson "future"
        Examples:
            | status    |
            | Draft     |
            | Published |