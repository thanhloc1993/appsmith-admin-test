@cms
@lesson
@lesson-report-draft
@ignore

Feature: Teacher can edit draft group lesson report of past one time lesson
    Background:
        Given "teacher" logins CMS
        And "teacher" has created a one time group lesson in the past
        And "teacher" has applied center location in location settings is the same as location in the lesson
        And "teacher" has gone to detailed lesson info page
        And "teacher" has saved draft group lesson report with missing all fields
        And "teacher" has opened editing group lesson report

    Scenario: Teacher can edit draft lesson report of past one time lesson
        Given "teacher" has changed fields info
        When "teacher" saves draft for editing lesson report
        Then "teacher" is redirected to detailed lesson report page
        And "teacher" sees updated lesson report
        And "teacher" sees "Draft" tag of lesson report

    Scenario: Teacher can edit draft lesson report to submitted lesson report
        Given "teacher" has fulfilled lesson report info
        When "teacher" submits group lesson report
        Then "teacher" is redirected to detailed lesson report page
        And "teacher" sees updated lesson report
        And "teacher" sees "Submitted" tag of lesson report

    Scenario Outline: Teacher cannot edit draft lesson report to submitted lesson report with missing required field
        When "teacher" clicks submit all group lesson report
        Then "teacher" sees alert message below "<required-field>" field
        And "teacher" sees alert icon in student list
        And "teacher" is still in editing group lesson report page
        Examples:
            | required-field |
            | Content        |
            | Homework       |

    Scenario: Teacher can cancel editing draft lesson report to submitted lesson report
        Given "teacher" has changed fields info
        When "teacher" cancels submitting lesson report
        Then "teacher" is still in editing group lesson report page
