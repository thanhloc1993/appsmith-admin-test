@cms @cms2 @learner
@lesson
@lesson-report-draft

Feature: Teacher can save draft group lesson report of one time past lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And "student" with course and class and enrolled status has logged Learner App
        And "teacher" has created a one time "group" lesson in the "past"
        And "teacher" has applied location in location settings is the same as location in the lesson
        And "teacher" has gone to detailed lesson info page
        And "teacher" has opened creating "group" lesson report page

    Scenario: Teacher can save draft group lesson report of past lesson
        Given "teacher" has fulfilled group lesson report info
        When "teacher" saves draft group lesson report
        Then "teacher" is redirected to detailed group lesson report page
        And "teacher" sees fulfilled group lesson report info
        And "teacher" sees "Draft" tag of lesson report

    Scenario: Teacher can save draft group lesson report of past lesson with missing field
        When "teacher" saves draft group lesson report with missing all fields
        Then "teacher" is redirected to detailed group lesson report page
        And "teacher" sees blank group lesson report info
        And "teacher" sees "Draft" tag of lesson report
