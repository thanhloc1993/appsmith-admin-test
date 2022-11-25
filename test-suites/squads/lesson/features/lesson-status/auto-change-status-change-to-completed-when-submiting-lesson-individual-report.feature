@cms
@lesson
@lesson-status
@ignore

Feature: The status auto-change to Completed when submit individual lesson report
    Background:
        Given "school admin" logins CMS
        And "school admin" has applied "all child locations of parent" location

    Scenario Outline: The status auto-change to Completed when submitting the lesson report of the <status> one time individual lesson
        Given "school admin" has created a "<status>" one time "individual" lesson
        And "school admin" has gone to detailed lesson info page
        And "school admin" has opened creating "individual" lesson report page
        And "school admin" has fulfilled individual lesson report info
        When "school admin" submits "individual" lesson report
        Then "school admin" is redirected to detailed lesson report page
        And "school admin" sees the lesson's status is "Completed"
        Examples:
            | status    |
            | Draft     |
            | Published |

    Scenario Outline: The status auto-change to Completed when submitting lesson report of the <status> weekly recurring individual lesson
        Given "school admin" has created "<status>" weekly recurring "individual" lesson in the "future"
        And "school admin" has gone to detailed lesson info page of the 2nd lesson in the chain
        And "school admin" has opened creating "individual" lesson report page
        And "school admin" has fulfilled individual lesson report info
        When "school admin" submits "individual" lesson report
        Then "school admin" is redirected to detailed lesson report page
        And "school admin" sees the lesson's status is "Completed"
        And "school admin" sees the status of the all lessons in the chain still is "<status>"
        Examples:
            | status    |
            | Draft     |
            | Published |
