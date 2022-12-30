@cms @cms2
@lesson
@lesson-report-draft
@ignore

Feature: Teacher can save draft individual lesson report of future lesson
    Background:
        Given "school admin" logins CMS
        And "teacher" logins CMS
        And school admin has created a lesson of lesson management with start date&time is within 10 minutes from now
        And "teacher" has gone to detailed lesson info page
        And "teacher" has opened creating "individual" lesson report page

    Scenario: Teacher can save draft lesson report of future lesson
        Given "teacher" has fulfilled lesson report info
        When "teacher" saves draft individual lesson report
        Then "teacher" is redirected to detailed lesson report page
        And "teacher" sees fulfilled lesson report info
        And "teacher" sees "Draft" tag of lesson report

    Scenario: Teacher can save draft lesson report of future lesson with missing field
        When "teacher" saves draft individual lesson report with missing all fields
        Then "teacher" is redirected to detailed lesson report page
        And "teacher" sees blank lesson report info
        And "teacher" sees "Draft" tag of lesson report
