@cms @cms2 @learner
@lesson
@lesson-report-submit

Feature: Teacher can submit group lesson report of a future lesson in the recurring chain
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And "student" with course and class and enrolled status has logged Learner App
        And "teacher" has created a weekly recurring "group" lesson with lesson date in the "past"
        And "teacher" has applied location in location settings is the same as location in the lesson
        And "teacher" has gone to detailed lesson info page of the "past" lesson in the middle of the recurring chain
        And "teacher" has opened creating "group" lesson report page

    Scenario: Teacher can submit lesson report of future lesson
        Given "teacher" has fulfilled group lesson report info
        When "teacher" submits group lesson report
        Then "teacher" is redirected to detailed group lesson report page
        And "teacher" sees fulfilled group lesson report info
        And "teacher" sees "Submitted" tag of lesson report

    Scenario Outline: Teacher cannot submit lesson report of future lesson with missing field
        Given "teacher" has filled group lesson report info with missing "<required-field>" field
        When "teacher" submits lesson report with missing "<required-field>" field
        Then "teacher" sees alert message below "<required-field>" field
        And "teacher" is still in creating group lesson report page
        Examples:
            | required-field |
            | Content        |
            | Homework       |

    Scenario: Teacher can cancel submitting lesson report of future lesson
        Given "teacher" has fulfilled group lesson report info
        When "teacher" cancels submitting group lesson report
        Then "teacher" is still in creating group lesson report page
