@cms @cms2
@lesson
@lesson-report-submit

Feature: Teacher can edit submitted group lesson report of past one time lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And "school admin" has created a "One Time" group lesson with filled all information in the "future"
        And "teacher" has applied location in location settings is the same as location in the lesson
        And "teacher" has gone to detailed lesson info page
        And "teacher" has created a group lesson report
        And "teacher" has opened editing group lesson report

    Scenario: Teacher can edit submitted lesson report of past one time lesson
        Given "teacher" has changed fields info of group lesson report
        When "teacher" submits group lesson report
        Then "teacher" is redirected to detailed group lesson report page
        And "teacher" sees updated lesson report
        And "teacher" sees "Submitted" tag of lesson report

    Scenario Outline: Teacher cannot edit submitted lesson report of past one time lesson
        Given "teacher" has cleared "<required-field>" value of group lesson report
        When "teacher" clicks submit all group lesson report
        Then "teacher" sees alert message below "<required-field>" field
        And "teacher" is still in editing group lesson report page
        Examples:
            | required-field |
            | Content        |
            | Homework       |

    Scenario: Teacher can edit submitted lesson report to draft lesson report with missing all fields
        Given "teacher" has cleared all fields of group lesson report
        When "teacher" saves draft a group lesson report
        Then "teacher" is redirected to detailed group lesson report page
        And "teacher" sees updated lesson report
        And "teacher" sees "Draft" tag of lesson report

    Scenario: Teacher can cancel editing submitted lesson report
        Given "teacher" has changed fields info of group lesson report
        When "teacher" cancels submitting group lesson report
        Then "teacher" is still in editing group lesson report page
