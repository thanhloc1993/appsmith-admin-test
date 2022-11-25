@cms
@lesson
@lesson-report-submit
@ignore

Feature: Teacher can edit submitted group lesson report of a future lesson in the recurring chain
    Background:
        Given "teacher" logins CMS
        And "teacher" has created a weekly recurring group lesson with lesson date in the future
        And "teacher" has applied center location in location settings is the same as location in the lesson
        And "teacher" has gone to detailed lesson info page of the 2nd lesson in the recurring chain
        And "teacher" has created an group lesson report
        And "teacher" has opened editing group lesson report

    Scenario: Teacher can edit submitted lesson report of future recurring lesson
        Given "teacher" has changed fields info
        When "teacher" submits for editing lesson report
        Then "teacher" is redirected to detailed lesson report page
        And "teacher" sees updated lesson report
        And "teacher" sees "Submitted" tag of lesson report

    Scenario Outline: Teacher cannot edit submitted lesson report of future recurring lesson
        Given "teacher" has cleared "<required-field>" value
        When "teacher" clicks submit all individual lesson report
        Then "teacher" sees alert message below "<required-field>" field
        And "teacher" sees alert icon in student list
        And "teacher" is still in editing group lesson report page
        Examples:
            | required-field |
            | Content        |
            | Homework       |

    Scenario: Teacher can edit submitted lesson report to draft lesson report with missing all fields
        Given "teacher" has cleared all fields
        When "teacher" saves draft for editing lesson report
        Then "teacher" is redirected to detailed lesson report page
        And "teacher" sees updated lesson report
        And "teacher" sees "Draft" tag of lesson report

    Scenario: Teacher can cancel editing submitted lesson report
        Given "teacher" has changed fields info
        When "teacher" cancels submitting lesson report
        Then "teacher" is still in editing group lesson report page
